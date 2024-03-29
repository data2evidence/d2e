import { Injectable } from '@nestjs/common'
import { IFlowCsvNodeData, IPrefectEdge, IPrefectParameters, IReactFlow, IReactFlowNode } from '../types'

@Injectable()
export class PrefectParamsTransformer {
  transform(flow: IReactFlow, isTestMode = false): IPrefectParameters {
    const nodes = flow.nodes
    const subflowNodes = [] // nodes have been added into the subflow
    const options = { trace_config: { trace_mode: true, trace_db: 'alp' }, test_mode: isTestMode }
    let edges = flow.edges
    let edgeNum = 1

    const nodeIdNameMap = nodes.reduce((acc, node) => {
      acc[node.id] = node.data.name
      return acc
    }, {})

    const prefectNodes = nodes.reduce((acc, node) => {
      const isCsv = (n: any): n is IFlowCsvNodeData => n.type === 'csv_node'
      const { id, type, parentNode } = node
      const { name, description, executorOptions, ...prefectVars } = node.data
      if (isCsv(node)) {
        delete (<IFlowCsvNodeData>prefectVars).hasheader
      }
      // construct prefect subflow
      if (type === 'subflow') {
        // find all children
        const children = nodes.filter(n => n.parentNode === id)
        const childrenIds = children.map(child => child.id)
        subflowNodes.push(...childrenIds)
        // find all edges inside subflow
        const internalEdges = edges.filter(e => {
          return childrenIds.includes(e.source) && childrenIds.includes(e.target)
        })
        const subflowEdges = this.buildPrefectEdges(nodeIdNameMap, internalEdges, edgeNum)
        edgeNum += internalEdges.length
        acc[name] = {
          ...prefectVars,
          id: id,
          type: type,
          graph: {
            edges: subflowEdges,
            nodes: this.convertArrayToObject(children)
          },
          executor_options: executorOptions
        }
        // remove edges which have already been populated
        edges = edges.filter(e => {
          return !childrenIds.includes(e.source) || !childrenIds.includes(e.target)
        })
      } else {
        acc[name] = {
          ...prefectVars,
          id: id,
          type: type,
          parentNode: parentNode
        }
      }
      return acc
    }, {})
    // remove nodes which already inside subflow
    for (const key of Object.keys(prefectNodes)) {
      if (subflowNodes.includes(prefectNodes[key].id)) {
        delete prefectNodes[key]
      }
    }

    const prefectEdges = this.buildPrefectEdges(nodeIdNameMap, edges, edgeNum)

    return {
      json_graph: {
        nodes: prefectNodes,
        edges: prefectEdges
      },
      options
    }
  }

  private buildPrefectEdges(nodeIdNameMap, edges, edgeNum): IPrefectEdge {
    let count = edgeNum
    return edges.reduce((acc, edge) => {
      acc[`e${count}`] = {
        source: nodeIdNameMap[edge.source],
        target: nodeIdNameMap[edge.target]
      }
      count++
      return acc
    }, {})
  }

  private convertArrayToObject(arr: IReactFlowNode[]) {
    return arr.reduce((acc, obj) => {
      const isCsv = (n: any): n is IFlowCsvNodeData => n.type === 'csv_node'
      const { id, type } = obj
      const { name, description, ...prefectVars } = obj.data
      if (isCsv(obj)) {
        delete (<IFlowCsvNodeData>prefectVars).hasheader
      }
      acc[name] = { ...prefectVars, id: id, type: type }
      return acc
    }, {})
  }
}

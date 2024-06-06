import { Injectable } from '@nestjs/common'
import { IFlowCsvNodeData, IPrefectEdge, IPrefectParameters, IReactFlow } from '../types'

@Injectable()
export class PrefectAnalysisParamsTransformer {
  transform(flow: IReactFlow, isTestMode = false): IPrefectParameters {
    const edges = flow.edges
    const nodes = flow.nodes
    const options = { trace_config: { trace_mode: true, trace_db: 'alp' }, test_mode: isTestMode }

    const nodeIdNameMap = nodes.reduce((acc, node) => {
      acc[node.id] = node.data.name
      return acc
    }, {})

    const prefectEdges = this.buildPrefectEdges(nodeIdNameMap, edges)

    const prefectNodes = nodes.reduce((acc, node) => {
      const isCsv = (n: any): n is IFlowCsvNodeData => n.type === 'csv_node'
      const { id, type } = node

      const { name, description, ...prefectVars } = node.data
      if (isCsv(node)) {
        delete (<IFlowCsvNodeData>prefectVars).hasheader
      }

      acc[name] = {
        ...prefectVars,
        id: id,
        type: type
      }
      return acc
    }, {})
    return {
      json_graph: {
        nodes: prefectNodes,
        edges: prefectEdges
      },
      options
    }
  }

  private buildPrefectEdges(nodeIdNameMap, edges): IPrefectEdge {
    let count = 1
    return edges.reduce((acc, edge) => {
      acc[`e${count}`] = {
        source: nodeIdNameMap[edge.source],
        target: nodeIdNameMap[edge.target]
      }
      count++
      return acc
    }, {})
  }
}

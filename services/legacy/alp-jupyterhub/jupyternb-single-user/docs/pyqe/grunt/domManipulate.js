const HTMLParser = require('node-html-parser');
const fs = require('fs');
const options = {
  comment: true,
  blockTextElements: {
    script: true,
    noscript: true,
    style: true,
    pre: true
  }
}

const htmlData = fs.readFileSync('./html/index.html', 'utf8');
const htmlDataRoot = HTMLParser.parse(htmlData, options)
const bodyNode = htmlDataRoot.querySelector('body')

//Remove Related div nodes, causing issue in Juypterhub iframe viewer
while (bodyNode.querySelector('div.related')) {
  let relatedNode = bodyNode.querySelector('div.related')
  relatedNode.remove()
}

const templateData = fs.readFileSync('./html/staging-template-index.html', 'utf8');
const templateDataRootNode = HTMLParser.parse(templateData, options)
const templateDataHtmlNode = templateDataRootNode.querySelector('html')
templateDataHtmlNode.appendChild(bodyNode)

fs.writeFileSync('./html/final-template-index.html', templateDataHtmlNode.toString()) //To be consumed by grunt

console.log("DOM Manipulation completed..")
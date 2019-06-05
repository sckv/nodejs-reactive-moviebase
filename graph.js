const input = 'a->b->g->h c->d d->f';

function makeGraph(inputData) {
  if (!inputData || typeof inputData !== 'string') return 'There has to be an input sequence string';
  const splitted = inputData.split(' ');
  const nodes = makeNodes(splitted);
}

function makeNodes(splittedGraphs) {
  const nodes = new Map();

  for (let graph of splittedGraphs) {
    graph = graph.replace(/->/gi, '');
    const { length } = graph;

    graph.forEach((node, index) => {
      let nodeEdges = nodes.get(node);
      nodeEdges = nodeEdges || { from: new Set(), to: new Set() };

      if (index > 0) nodeEdges.from.add(graph[index - 1]);
      if (index < length - 1) nodeEdges.to.add(graph[index + 1]);

      nodes.set(node, nodeEdges);
    });
  }
  return nodes;
}

function sortGraph(nodesMap) {
  const sorted = new Set();
}

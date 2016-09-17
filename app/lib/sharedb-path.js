export function getTargetBlock(component, startingPoint) {
  const path = component.p;

  if (component.si || component.sd) {
    return parseStringPath(path, startingPoint).block;
  } else if (component.li || component.ld) {
    const { parent, property, index } = parseListPath(path, startingPoint);
    return parent.get(property).objectAt(index);
  } else if (component.oi || component.od) {
    return parseObjectPath(path, startingPoint).block;
  }

  throw new Error(`Cannot locate block for path: ${path}`);
}

export function parseListPath(path, startingPoint) {
  path = ['blocks'].concat(path);

  const pathToParent = path.slice(0, path.length - 2);
  const parent = traversePath(pathToParent, startingPoint);

  return {
    parent,
    property: path[path.length - 2] || 'blocks',
    index: path[path.length - 1]
  };
}

export function parseObjectPath(path, startingPoint) {
  path = ['blocks'].concat(path);

  let index, parent, pathToParent, property;
  if (path[2] === 'blocks') {
    pathToParent = path.slice(0, 2);
    parent = traversePath(pathToParent, startingPoint);
    index = path[3];
    property = path[2];
  } else {
    parent = startingPoint;
    index = path[1];
    property = path[0];
  }

  const block = parent.get(property).objectAt(index);
  const metaIndex = path.indexOf('meta');
  const metaPath = path.slice(metaIndex);
  return { block, metaPath };
}

export function parseStringPath(path, startingPoint) {
  path = ['blocks'].concat(path);

  const pathToBlock = path.slice(0, path.length - 2);
  const block = traversePath(pathToBlock, startingPoint);

  return {
    block,
    property: path[path.length - 2],
    offset: path[path.length - 1]
  };
}

function traversePath(path, startingPoint) {
  return path.reduce((object, pathSegment) => {
    switch (typeof pathSegment) {
      case 'string':
        return object.get(pathSegment);
      case 'number':
        return object.objectAt(pathSegment);
      default:
        throw new Error(`Cannot traverse path segment: ${pathSegment}`);
    }
  }, startingPoint);
}

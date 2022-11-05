//  新增
const createNode = () => {

}

export {
    createNode
}

//  提纯
const purificationData = (edges, nodes) => {
    const _edges = edges.map((edge) => {
        const {source, target, label} = edge;
        return {source, target, label}
    });

    const _nodes = nodes.map((node) => {
        const {data, position, id, label, type} = node;
        return {data, position, id, label, type}
    });
    return {
        _edges,
        _nodes
    }
}

export {
    purificationData
}


//  载入数据，假设是服务端返回的
const loadData = () => {
    const _nodes = [
        {id: '1', label: 'Node 1', position: {x: 250, y: 5}, type: 'input',},
        {id: '2', label: 'Node 2', position: {x: 100, y: 100}},
        {id: '3', label: 'Node 3', position: {x: 400, y: 100}},
        {id: '4', label: 'Node 4', position: {x: 400, y: 200}},
    ];
    const _edges = [
        {id: 'e1-2', source: '1', target: '2', label: '12345432',  },
        {id: 'e1-3', source: '1', target: '3',  },
        {id: 'e3-4', source: '3', target: '4',  },
    ];
    return {
        _edges, _nodes
    }
}
export {
    loadData
}
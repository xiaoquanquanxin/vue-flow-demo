<template>

    <div class="container">

        <div class="main">
            <VueFlow/>
        </div>
        <div class="info">
            <div><label for="label">label</label><input type="text" id="label" v-model="state.label"></div>
            <div><label for="type">type</label><select id="type" v-model="state.type">
                <option value="input">输入</option>
                <option value="output">输出</option>
                <option value="">一般</option>
            </select></div>
            <div><label for="x">x</label><input type="number" id="x" v-model="state.x"></div>
            <div><label for="y">y</label><input type="number" id="y" v-model="state.y"></div>
            <div><label for="id">id</label><input type="text" id="id" v-model="state.id" disabled></div>
            <div><label for="extra1">extra1</label><input type="text" id="extra1" v-model="state.extra1"></div>
            <div><label for="extra2">extra2</label><input type="text" id="extra2" v-model="state.extra2"></div>
            <p style="color: red">
                问题一：<br>
                想选择一个逻辑编排的库，看看怎么实现的，借鉴借鉴<br>
                <b>略</b><br>
                问题二：<br>
                后端，测试同学，他们知道自己想要的图长什么样子，顶多接受一个节点、边、布局的概念，他们肯定不会去了解 keyShape node 等等深入的概念，需要解决的问题就是
                如何让他们能够接受使用，并自行搭建出他们想要的图，完成任务，又释放部分前端人力<br>
                <b>略</b><br>
                问题三：<br>
                布局，我添加了一个节点，如何自动的把这个节点放到合适的位置，布局算法的如何处理<br>
                <b>布局就是表单的x、y</b><br>
                问题四：<br>
                节点任意配置，就是这个节点，是人动态配置的，他可能想把这个节点 配合输入框，下拉框，等等一系列的组合，最后变成一个 节点<br>
                <b>这个东西肯定除了服务端想要动输入框、下拉框数据外，还有一些基础数据。表单中，id字段以上的都是基础数据，extra为前缀的数据才是服务端关心的数据，就是服务端想要的input、select，这里我不知道你们需要多复杂的结构。我们是先维护一个map需要什么字段就动态载入控件</b>
                <br>
                <b>另外要关心的就是查询详情类似的业务，就是服务端存的数据怎么展示出来，这个点载入数据</b>
                <br>
                <b>查看数据基本就是要存到服务端的数据结构</b>
            </p>

            <br>
            <div>
                <button @click="createButtonClick">{{state.id?'编辑':'新增'}}</button>
                <button @click="submitClick">{{state.id?'保存编辑':'保存新增'}}</button>
                <button @click="deleteClick">删除</button>
                <button @click="loadDataClick">载入数据</button>
                <button @click="viewDataClick">查看数据</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {reactive, toRaw} from "vue";
    import {Elements, useVueFlow, VueFlow} from '@braks/vue-flow'
    import {  purificationData, loadData} from "./utils/index";
    import '@vue-flow/core/dist/theme-default.css';
    import '@vue-flow/core/dist/style.css';


    const initState = {
        id: '',
        label: '',
        type: '',
        extra1: '',
        extra2: '',
        x: 0,
        y: 0,
    };

    const state = reactive({...initState});

    //  初始化数据
    const initStateFn = () => {
        Object.assign(state, initState);
    }

    //  点击节点
    const clickNode = (e) => {
        const {position, type, id, data, label} = e.node;
        //  赋值
        Object.assign(state, {...position, type, extra1: data.extra1, extra2: data.extra2, label, id});
    }

    const {addNodes, nodes, onConnect, onNodeDragStop, setNodes, setEdges, removeEdges, removeNodes, addEdges, edges} = useVueFlow({
        nodes: [],
        edges: [],
    })

    onConnect((params) => {
        const label = window.prompt('请输入链接关系');
        addEdges([{...params,label}])
    })

    onNodeDragStop((node) => console.log('停止拖拽', node))


    //  新增
    const createButtonClick = () => {
        initStateFn();
    };
    //  查看数据
    const viewDataClick = () => {
        console.log('查看state数据');
        const {_edges, _nodes} = purificationData(edges.value, nodes.value);
        console.log('edges', _edges);
        console.log('_nodes', _nodes)
    }

    //  确定
    const submitClick = () => {
        viewDataClick();
        const {label, type, extra1, extra2, x, y, id} = state;
        const position = {x, y};
        // console.log(toRaw(nodes.value));
        if (id) {
            //  编辑
            const node = nodes.value.find((node) => {
                return (node.id === id);
            })
            // console.log('编辑的node',node);
            //  赋值
            Object.assign(node, {label, type, data: {extra1, extra2}, position: {x, y}, id});
        } else {

            //  新建
            addNodes([
                {
                    id: (nodes.value.length + 1).toString(),
                    type,
                    label,
                    data: {extra1, extra2},
                    position,
                    events: {
                        click: clickNode,
                    }
                }
            ])
        }
        initStateFn();
    }
    //  删除
    const deleteClick = () => {
        if (!state.id) {
            return
        }
        const node = nodes.value.find((node) => {
            return (node.id === state.id);
        })
        //  删除节点
        removeNodes([node], true)
    }

    //  载入数据
    const loadDataClick = async () => {
        const {_edges, _nodes} = loadData();
        await removeNodes(nodes.value)
        await removeEdges(edges.value);

        await setNodes([..._nodes]);
        await addEdges([..._edges]);

    }
</script>

<style scoped lang="less">

    button {
        padding: 10px 20px;
    }


    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;


        .main {
            background-color: whitesmoke;
            flex: 1;
            height: 100vh;
            position: relative;
        }

        .info {
            background-color: lightyellow;
            width: 500px;
            height: 100vh;

            label {
                width: 60px;
                display: inline-block;
            }
        }
    }
</style>

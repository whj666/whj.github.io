import React from "react";
import {Form, Button, Input, Popconfirm, Table, Divider} from 'antd';
import QueueAnim from 'rc-queue-anim';
import {getApi, postApi} from "api";
import {urls} from "urls";
import SearchBar from "./searchBar";
import RightModal from "rightModal";
import NewTable from "./newTable";
import {getViewPort} from 'public';

class TableMoudel extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            height: getViewPort().height,
            visible: false,
            total: null,
            curren: 1,
            pageSize: 20,
            modal: {
                name: null,
                age: null,
                type: null,
                email: null
            },
            columns: [{
                title: '姓名',
                dataIndex: 'name',
                width: '20%'
            },{
                title: '年龄',
                dataIndex: 'age',
                width: '20%',
            },{
                title: '人设',
                dataIndex: 'type',
                width: '20%'
            },,{
                title: '邮箱',
                dataIndex: 'email',
                width: '20%'
            },{
                title: '操作',
                dataIndex: 'operation',
                width: '20%',
                render: (text, record) => (
                    <span>
                        <a href="javascript:void(0);" onClick={() => this.edit(record)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="是否确定删除">
                            <a href="javascript:void(0);">删除</a>
                        </Popconfirm>
                    </span>
                )
            }]
        }
    }

    componentDidMount(){
        window.addEventListener('resize', this.handleHeight.bind(this));
        this.getTableData({userName:localStorage.userName});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleHeight.bind(this));
    }

    //查询数据
    getTableData(option){
        getApi(option, urls.getTableData, res => {
            let tableData = [];
            let userList = res.data.userList;
            for(let i in userList){
                tableData.push({
                    key:i,
                    name: userList[i].name,
                    age: userList[i].age,
                    type: userList[i].type,
                    email: userList[i].email,
                    id: userList[i].id
                });
            };

            this.setState({
                tableData
            });
        })
    }

    //获取浏览器高度
    handleHeight(){
        this.setState({ 
            height: getViewPort().height 
        });
    }

    //控制弹框是否显示
    visibleHandle(id){
        if(!id){
            this.setState({
                modal: Object.assign({}, {name: null, age: null, type: null, email: null})
            })
        };

        this.setState({
            visible: !this.state.visible
        });
    }

    //表格事件处理
    handleTableChange(pagination, filters, sorter){
        this.setState({
            curren: pagination.current
        })
    }

    //分页跳转
    onShowSizeChange(current, pageSize){
        this.setState({
            pageSize
        })
    }

    //编辑
    edit(record){
        let {name, age, type, email, id} = record;
        this.setState({
            modal: Object.assign({}, {name, age, type, email, id})
        },() => {
            this.visibleHandle(id);
        })
    }
  
    render(){
        return(
            <div className="tableMoudel h100">
                <SearchBar this={this} />

                <Table 
                    className="mt10"
                    columns={this.state.columns}
                    dataSource={this.state.tableData}
                    onChange={this.handleTableChange.bind(this)}
                    size="middle"
                    scroll={{ y: this.state.height - 93 - 162 }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        size: "small",
                        total: this.state.total,
                        current: this.state.curren,
                        pageSize: this.state.pageSize,
                        onShowSizeChange: this.onShowSizeChange.bind(this),
                    }}
                />

                <QueueAnim className="demo-content">
                    {this.state.visible &&
                        <NewTable 
                            key="NewTable"
                            rightModalHandle={this.visibleHandle.bind(this)}
                            data={this.state.modal}
                        />
                    }
                </QueueAnim>
            </div>
        );
    }
}

export default TableMoudel
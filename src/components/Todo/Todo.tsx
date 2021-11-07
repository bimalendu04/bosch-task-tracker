import CloseCircleOutlined from '@ant-design/icons/lib/icons/CloseCircleOutlined';
import { Row, Col, Table, Button, Modal, Layout } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import styles from './todo.module.scss';
import CreateTask from '../CreateTask/CreateTask';
import { IListType, IPriority, IStatus, ITask } from '../../models/common';
import _findIndex from 'lodash/findIndex';
import { useHistory } from 'react-router-dom';
import Search from 'antd/lib/input/Search';

export interface ITodoProps {
    listType: IListType
}

const Todo = (props: ITodoProps) => {
    const context = useContext(AppContext);
    let history = useHistory();
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    const [selectedToDelete, setSelectedToDelete] = useState<ITask>({
        id: '',
        name: '',
        company: '',
        priority: IPriority.VERY_LOW,
        status: IStatus.NEW,
        project: '',
        createdDate: 0,
        endDate: 0

    });

    const onStatusChange = useCallback((record: ITask) => {
        let task = { ...record };
        if (props.listType == IListType.TODO) {
            task.status = IStatus.IN_PROGRESS;
        } else {
            task.status = IStatus.COMPLETED;
            task.endDate = new Date().valueOf();
        }
        context.updateTasks(task);
    }, [context, props.listType]);

    const onDeleteClicked = useCallback((record: ITask) => {
        setSelectedToDelete(record);
    }, [setSelectedToDelete]);

    const onDeleteConfirmed = useCallback(() => {
        context.deleteTasks(selectedToDelete.id);
        reset();
    }, [setSelectedToDelete, context, selectedToDelete.id]);

    const reset = useCallback(() => {
        setSelectedToDelete({
            id: '',
            name: '',
            company: '',
            priority: IPriority.VERY_LOW,
            status: IStatus.NEW,
            project: '',
            createdDate: 0,
            endDate: 0
        })
    }, [setSelectedToDelete]);

    const onSearch = useCallback((value) => {
        context.updateSearchText(value)
    }, [context]);

    const handleSearchChange = useCallback((e) => {
        context.updateSearchText(e.target.value);
    }, [context]);

    const showProject = useCallback(() => {
        let projects = context.companies[_findIndex(context.companies, { id: selectedTask?.company })].projects;
        return projects[_findIndex(projects, { id: selectedTask?.project })].name;
    }, [context, selectedTask]);

    useEffect(() => {
        if (!context.isAuthenticated) {
            history.push('/login')
        }
    }, [context.isAuthenticated, history]);

    const columns = [
        {
            title: 'Task Id',
            dataIndex: 'id',
            key: 'id',
            render: (text: string, record: ITask) => <a onClick={() => setSelectedTask(record)}>{text}</a>,
        },
        {
            title: 'Task Name',
            dataIndex: 'name',
            key: 'id',
        },
        {
            title: 'Project',
            dataIndex: 'project',
            key: 'id',
            render: (text: string, record: ITask) => {
                let projects = context.companies[_findIndex(context.companies, { id: record.company })].projects;
                return projects[_findIndex(projects, { id: record.project })].name;
            }
        },
        {
            title: 'Priority',
            key: 'id',
            dataIndex: 'priority'
        },
        {
            title: props.listType === IListType.DONE ? 'Created on' : 'Action',
            key: 'id',
            render: (text: string, record: ITask) => {
                if (props.listType == IListType.DONE) {
                    return new Date(record.createdDate).toLocaleDateString();
                } else {
                    return <Button type="primary" onClick={() => onStatusChange(record)}>
                        {props.listType == IListType.TODO ? 'Start Task' : 'Complete'}
                    </Button >
                }

            },
        },
        {
            title: props.listType === IListType.DONE ? 'Completed on' : 'Remove',
            key: 'id',
            render: (text: string, record: ITask) => {
                if (props.listType == IListType.DONE) {
                    return new Date(record.endDate).toLocaleDateString();
                } else {
                    return <Button type="primary" onClick={() => onDeleteClicked(record)} icon={<CloseCircleOutlined />} />
                }

            },
        },
    ];


    return <>
        <Layout className={styles.layout}>
            {!(props.listType == IListType.DONE) && <Row className={styles.marBot20}>
                <Col span={24}>
                    <CreateTask />
                </Col>
            </Row>}
            <Row className={styles.marBot20}>
                <Col span={18}>
                    {props.listType == IListType.TODO ? 'To Do List' : (props.listType == IListType.IN_PROGRESS ? 'In Progress List' : 'Done List')}
                </Col>
                <Col span={6}>
                    <Search value={context.searchedText} placeholder="input search text" allowClear onSearch={onSearch} onChange={handleSearchChange} />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table columns={columns} dataSource={context.tasks.filter((ele) => props.listType == IListType.TODO ? ele.status == IStatus.NEW : (props.listType == IListType.IN_PROGRESS ? ele.status == IStatus.IN_PROGRESS : ele.status == IStatus.COMPLETED))} />
                </Col>
            </Row>
        </Layout>
        <Modal title="Delete Task" visible={Boolean(selectedToDelete.id)} onOk={onDeleteConfirmed} onCancel={() => reset()}>
            It will delete the task {selectedToDelete.name}. Continue ahead?
        </Modal>
        <Modal
            visible={selectedTask && Object.keys(selectedTask).length ? true : false}
            title="Task Details"
            onCancel={() => setSelectedTask(null)}
            onOk={() => setSelectedTask(null)}
            destroyOnClose={true}
        >
                <Row className={styles.marBot10}>
                    <Col span={6}>
                        <div className={styles.label}>Task Name :</div>
                    </Col>
                    <Col span={18}>
                        <div>{selectedTask ? selectedTask.name : ''}</div>
                    </Col>
                </Row>
                <Row className={styles.marBot10}>
                    <Col span={6}>
                        <div className={styles.label}>Description :</div>
                    </Col>
                    <Col span={18}>
                        <div>{selectedTask ? selectedTask.description : ''}</div>
                    </Col>
                </Row>
                <Row className={styles.marBot10}>
                    <Col span={6}>
                        <div className={styles.label}>Company :</div>
                    </Col>
                    <Col span={18}>
                        <div>{selectedTask ? context.companies[_findIndex(context.companies, { id: selectedTask.company })].name : ''}</div>
                    </Col>
                </Row>
                <Row className={styles.marBot10}>
                    <Col span={6}>
                        <div className={styles.label}>Project :</div>
                    </Col>
                    <Col span={18}>
                        <div>{selectedTask ? showProject() : ''}</div>
                    </Col>
                </Row>
                <Row className={styles.marBot10}>
                    <Col span={6}>
                        <div className={styles.label}>Priority :</div>
                    </Col>
                    <Col span={18}>
                        <div>{selectedTask ? selectedTask?.priority : ''}</div>
                    </Col>
                </Row>
                <Row className={styles.marBot10}>
                    <Col span={6}>
                        <div className={styles.label}>Status :</div>
                    </Col>
                    <Col span={18}>
                        <div>{selectedTask ? selectedTask?.status : ''}</div>
                    </Col>
                </Row>
        </Modal>
    </>;
}

export default Todo;
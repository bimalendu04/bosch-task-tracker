import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Form, Input, Button, Modal, Tooltip, Select } from "antd";
import { useCallback, useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { ITask, IPriority } from "../../models/common";

const { Option } = Select;
const { TextArea } = Input;

const CreateTask = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<number>(-1);


    const context = useContext(AppContext);

    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);

    const handleSave = useCallback((values: ITask) => {
        values.createdDate = new Date().valueOf();
        context.addTasks(values);
        setOpen(false);
    }, [context]);

    const openModal = useCallback(() => {
        setOpen(true);
    }, []);

    const setCompany = useCallback((value: string) => {
        setSelectedCompany(context.companies.findIndex(company => value == company.id));
    },[context]);

    return <>
        <Tooltip title="Add Task">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={openModal} />
        </Tooltip>
        <Modal
            visible={isOpen}
            title="Create Task"
            onCancel={handleCancel}
            footer={[
                <>
                    <Button type="primary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="primary" form="createTaskForm" key="submit" htmlType="submit">
                        Create
                    </Button>
                </>
            ]}
            destroyOnClose={true}
        >
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={handleSave}
                autoComplete="off"
                id="createTaskForm"
            >
                <Form.Item
                    name="name"
                    label="Task Name"
                    rules={[{ required: true, message: 'Please enter task name!' }]}
                >
                    <Input placeholder="Task Name" />
                </Form.Item>
                <Form.Item
                    name="company"
                    label="Company"
                    rules={[{ required: true, message: 'Please select a company name' }]}
                >
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a Company"
                        onChange={setCompany}
                    >
                        {context.companies.map((company, index) => <Option key={company.id} value={company.id}>{company.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Project"
                    name="project"
                    rules={[{ required: true, message: 'Please select your project!' }]}
                >
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a Project"
                    >
                        {selectedCompany > -1 && context.companies[selectedCompany].projects.map(project => <Option key={project.id} value={project.id}>{project.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[{ required: true, message: 'Please select your priority!' }]}
                >
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select Priority"
                    >
                        {Object.values(IPriority).map(priority => <Option key={priority} value={priority}>{priority}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Task Description"
                    name="description"
                >
                    <TextArea rows={4} placeholder="Description" />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default CreateTask;
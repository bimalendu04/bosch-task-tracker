import React, { useCallback, useContext, useEffect } from "react";
import { Form, Input, Button, Layout, Row, Col, notification } from 'antd';
import { login, ILoginResponse } from '../../services/UserServices';
import AppContext from "../../context/AppContext";
import { useHistory } from "react-router";
import { IUser } from "../../models/common";
import styles from './login.module.scss';
import { NotificationApi } from "antd/lib/notification";
import { openNotification } from "../../utilities/Notification";

export interface ILogin {

};

const Login = (props: ILogin) => {
    const context = useContext(AppContext);
    let history = useHistory();

    const onFinish = (values: any) => {
        login(values.userName, values.password).then((responseData: ILoginResponse) => {
            context.updateIsAuth(responseData.isSuccess);
            context.updateloggedUser(responseData.userDetails || {} as IUser);
            openNotification(responseData.userDetails?.first_name, responseData.isSuccess ? 'loginSuccess' : 'error');
            history.push('/home');
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    // const openNotification = useCallback((type: string) => {
    //     if(type == 'loginSuccess') {
    //         notification.success({
    //             message: `Welcome ${context.authUserDetails?.first_name}`
    //         });
    //     } else if(type == 'error') {
    //         notification.error({
    //             message: `user name or password incorrect`
    //         });
    //     } else {
    //         notification.success({
    //             message: `Successfully logged out`
    //         });
    //     }
    // }, [context.authUserDetails]);

    useEffect(() => {
        if (context.isAuthenticated) {
            history.push('/home')
        }
    }, [context.isAuthenticated, history]);
    return (
        <Layout className={styles.layout}>
            <Row>
                <Col span={18} >
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="userName"
                            label="User Name"
                            rules={[{ required: true, message: 'Please enter user name!' }]}
                        >
                            <Input placeholder="User Name" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Layout>
    );
}

export default React.memo(Login);
import { Row, Col, Layout, Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useContext, useEffect } from 'react';
import styles from './home.module.scss';
import AppContext, { IAppContext } from '../../context/AppContext';
import { useHistory } from 'react-router-dom';
import CreateTask from '../CreateTask/CreateTask';

export interface IHomeProps {

}
const Home = (props: IHomeProps) => {
    const context: IAppContext = useContext(AppContext);
    let history = useHistory();

    useEffect(() => {
        if (!context.isAuthenticated) {
            history.push('/login')
        }
    }, [context.isAuthenticated, history]);

    return <Layout className={styles.layout}>
        <Row>
            <Col span={24}>
                <CreateTask />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <div className={styles.cardContainer}>
                    <div className={styles.iconWrapper}>
                        {
                            context.authUserDetails?.avatar ?
                                <Avatar src={<Image src={context.authUserDetails?.avatar} style={{ width: 32 }} />} />
                                :
                                <UserOutlined />
                        }
                    </div>
                    <h2>{`Hi, ${context.authUserDetails?.first_name}`}</h2>
                    <h2>Welcome to Task Tracker</h2>
                    <h6>Create, View & Delete tasks made easy</h6>
                </div>
            </Col>
        </Row>
    </Layout>
}

export default React.memo(Home);
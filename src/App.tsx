import styles from './App.module.scss';
import 'antd/dist/antd.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { Avatar, Layout, Menu, Image, Dropdown } from 'antd';

import { AppProvider } from './context/AppContext';
import _uniqueId from 'lodash/uniqueId';
import _findIndex from 'lodash/findIndex';



import Home from './components/Home/Home';
import { useCallback, useEffect, useState } from 'react';
import Login from './components/Login/Login';
import Todo from './components/Todo/Todo';
import { IStatus, ITask, IListType, IUser } from './models/common';
import { openNotification } from './utilities/Notification';

const { Header, Sider, Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(sessionStorage.getItem('isLoggedIn')));
  const [authUserDetails, setAuthUserDetails] = useState<IUser | null>(JSON.parse(sessionStorage.getItem('userDetails') || '{}'));

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [searchedText, setSearchedText] = useState<string>('');

  const updateSearchText = useCallback((value: string) => {
    setSearchedText(value);
  },[setSearchedText]);

  const updateIsAuth = useCallback((value: boolean) => {
    setIsAuthenticated(value);
    sessionStorage.setItem('isLoggedIn', value.toString());
  }, [setIsAuthenticated]);

  const updateloggedUser = useCallback((value: IUser) => {
    setAuthUserDetails(value);
    sessionStorage.setItem('userDetails', JSON.stringify(value));
  }, [setAuthUserDetails]);

  const updateTasks = useCallback((task: ITask) => {
    let tasksCopy: ITask[] = [...allTasks];
    let index: number = _findIndex(tasksCopy, { id: task.id });
    tasksCopy[index] = task;
    setAllTasks(tasksCopy);
  }, [allTasks, setAllTasks]);

  const addTasks = useCallback((task: ITask) => {
    task.id = _uniqueId('TT-');
    task.status = IStatus.NEW;
    setAllTasks([...allTasks, task]);
  }, [allTasks, setAllTasks]);

  const deleteTasks = useCallback((id: string) => {
    let tasksCopy: ITask[] = [...allTasks];
    let index: number = _findIndex(tasksCopy, { id: id });
    tasksCopy.splice(index, 1);
    setAllTasks(tasksCopy);
  }, [allTasks, setAllTasks]);

  const onLogout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthUserDetails(null);
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    let taskCopy = [];
    if (searchedText) {
      taskCopy = allTasks.filter((task) => {
        return task.name.toLowerCase().includes(searchedText.toLowerCase()) || task.id.toLowerCase().includes(searchedText.toLowerCase())
      });
    } else {
      taskCopy = [...allTasks];
    }
    setTasks(taskCopy);
  }, [searchedText, allTasks, setTasks]);

  return (
    <Layout className={styles.layout}>
      <Header>
        <span className={styles.title}>Task Tracker</span>
        {isAuthenticated ?
          <Dropdown overlayClassName={styles.overlay} overlay={<span className={styles.logout} onClick={() => {
            onLogout();
            openNotification('', 'loggedout');
            }}>Logout</span>}>
            <div className={styles.userAvatarDetails}>
              <span className={styles.userName}>{`${authUserDetails?.first_name} ${authUserDetails?.last_name}`}</span>
              <Avatar src={<Image src={authUserDetails?.avatar} style={{ width: 32 }} />} />
            </div>
          </Dropdown>
          : <></>}
      </Header>
      <AppProvider value={{
        isAuthenticated,
        authUserDetails,
        searchedText,
        tasks,
        allTasks,
        companies: [
          {
            name: 'Company 1',
            id: '1',
            projects: [
              {
                name: 'Project 1 of Company 1',
                id: '1'
              },
              {
                name: 'Project 1 of Company 1',
                id: '2'
              }
            ]
          },
          {
            name: 'Company 2',
            id: '2',
            projects: [
              {
                name: 'Project 1 of Company 2',
                id: '3'
              }
            ]
          }
        ],
        updateIsAuth,
        updateloggedUser,
        updateTasks,
        addTasks,
        deleteTasks,
        updateSearchText
      }}>
        <Layout>
          <Router>
            <Sider>
              <Menu
                defaultSelectedKeys={[window.location.pathname.replaceAll('/', '')]}
                mode="inline"
                theme="dark"
                inlineCollapsed={false}
              >
                <Menu.Item key="home" >
                  <Link to="/home">Home</Link>
                </Menu.Item>
                <Menu.Item key="todo" >
                  <Link to="/todo">To do</Link>
                </Menu.Item>
                <Menu.Item key="inprogress" >
                  <Link to="/inprogress">In Progress</Link>
                </Menu.Item>
                <Menu.Item key="done" >
                  <Link to="/done">Done</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content>

              <Switch>
                <Route path="/todo">
                  <Todo listType={IListType.TODO} />
                </Route>
                <Route path="/inprogress">
                  <Todo listType={IListType.IN_PROGRESS} />
                </Route>
                <Route path="/done">
                  <Todo listType={IListType.DONE} />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
                <Redirect to="/" />
              </Switch>
            </Content>
          </Router>
        </Layout>
      </AppProvider>
    </Layout>
  );
}

export default App;

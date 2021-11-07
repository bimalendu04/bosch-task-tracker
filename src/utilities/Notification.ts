import notification from "antd/lib/notification";

const openNotification = (name:string | undefined, type: string) => {
    if(type == 'loginSuccess') {
        notification.success({
            message: `Welcome ${name}`
        });
    } else if(type == 'error') {
        notification.error({
            message: `user name or password incorrect`
        });
    } else {
        notification.success({
            message: `Successfully logged out`
        });
    }
};

export {openNotification};
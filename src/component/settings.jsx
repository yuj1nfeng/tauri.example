
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import { useState } from 'react';


export default () => {
    const [visible, setVisible] = useState(false);



    const closeModal = () => {

        setVisible(false);

    };


    return (
        <>
            <ui.Button
                size='small'
                variant="text"
                shape="square"
                onClick={() => setVisible(true)}
                icon={<icon.Setting1FilledIcon />} />

            <ui.Dialog
                mode="full-screen"
                visible={visible}
                onCancel={closeModal}
                onConfirm={closeModal}
                closeBtn={true}
                onClose={closeModal}
                cancelBtn={false}
                confirmBtn={false}

                footer={<ui.Button size='small' style={{ width: '100%' }} onClick={closeModal}>保存</ui.Button>}
                style={{ padding: '10px 22px 28px 22px' }}
                destroyOnClose={true}
            >

                <ui.Form labelAlign="left" labelWidth={80} colon >
                    <ui.Form.FormItem label="名字" name="name" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="密码" name="password" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="年龄" name="age" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="性别" name="gender" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="邮箱" name="email" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="电话" name="phone" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="地址" name="address" children={<ui.Input size='small' />} />
                    <ui.Form.FormItem label="备注" name="remark" children={<ui.Input size='small' />} />
                </ui.Form>
            </ui.Dialog>
        </>
    )

        ;
};
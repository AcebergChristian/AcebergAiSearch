import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Select, Message, Drawer, Spin, Tooltip, Divider, Avatar } from '@arco-design/web-react';
import {
  IconMenu,
  IconLanguage,
  IconMoonFill,
  IconSunFill,
  IconSearch,
  IconReply,
  IconUser,
  IconLock,
  IconSafe
} from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import useLocale from '@/utils/useLocale';
import { FormInstance } from '@arco-design/web-react/es/Form';
import apiClient from '@/utils/apiService';
import { GlobalContext } from '@/context';
import defaultLocale from '@/locale';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';
import indexstore from '@/store';
import { GlobalState } from '@/store';


function Usrcenter() {
  const TextArea = Input.TextArea;
  // 国际化
  const t = useLocale();

  const location = useLocation();

  const history = useHistory();
  const formRef = useRef<FormInstance>();

  // redux 的dispatch
  const dispatch = useDispatch();

  // 从localStorage获取用户信息 userInfo
  const username = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).username:'未登录'

  // 更新接口
  const savepathandkey =()=>{
    const data = formRef.current.getFieldsValue()
    
    apiClient.post('/api/usrcenter_update',
      data
    ).then((res) => {
      const { msg, status } = res.data;
        Message.success(msg);
    })
  }
  
  // 回显接口
  const showaccountpassword =()=>{
    const username = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).username:'admin'
    apiClient.post('/api/usrcenter_show',
      {account: username}
    ).then((res) => {
      const { msg, status, data } = res.data;
      formRef.current.setFieldsValue({
        account: data.account,
        password: data.password,
        role: data.role
      })

    })
  }

  useEffect(() => {
    showaccountpassword()
  },[])


  // 用户信息放到redux里
  // function fetchUserInfo() {
  //   dispatch({
  //     type: 'update-userInfo',
  //     payload: { userInfo: {...pathkey}},
  //   });
  // }

  // useEffect(() => {
  //   fetchUserInfo()
  // },[pathkey, dispatch])

  // const { settings, userLoading, userInfo } = useSelector(
  //   (state: GlobalState) => state
  // );
  //console.log('0000000000000',userInfo)


  return (
    <div className={styles.container}>
      <div className={styles.usrcenter_top}>
        <Button
          type='secondary'
          style={{ width: 30, height: 30, fontSize: 12, }}
          icon={<IconReply />}
          onClick={() => {
            history.push({
              pathname: '/aisearch',
            })
          }}
        />
        <div className={styles.usrcenter_top_title}>
          Usrcenter
        </div>
      </div>
      <div className={styles.usrcenter_avator}>
        <div>
          {username}
        </div>
      </div>
      <div className={styles.usrcenter_content}>
        <Form
          className={styles['login-form']}
          layout="vertical"
          ref={formRef}
          style={{ width: '80%' }}
        >
          <Form.Item
            label={t['usrcenter.account']}
            field="account"
          >
            <Input
              prefix={<IconUser />}
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            label={t['usrcenter.password']}
            field="password"
          >
            <Input
              prefix={<IconLock />}
              disabled={true}
              type='password'
              maxLength={16}
            />
          </Form.Item>
          <Form.Item
            label={t['usrcenter.role']}
            field="role"
          >
            <Input
              prefix={<IconSafe />}
              disabled={true}
            />
          </Form.Item>
          {/* <Form.Item
            style={
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }
          >
            <Button
              onClick={async () => {
                if (formRef.current) {
                  try {
                    savepathandkey()
                  } catch (_) {
                    console.log(formRef.current.getFieldsError());
                    Message.error('请检查必填字段！');
                  }
                }
              }}
              type='primary'
              style={{ marginRight: 24 }}
            >
              {t['usrcenter.save']}
            </Button>
            <Button
              onClick={() => {
                formRef.current.resetFields();
              }}
            >
              {t['usrcenter.reset']}
            </Button>
          </Form.Item> */}
        </Form>
      </div>
    </div>
  );
}

export default Usrcenter;

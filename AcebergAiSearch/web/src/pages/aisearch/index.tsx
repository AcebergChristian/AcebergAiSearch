import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Button, Form, Input, Select, Message, Drawer, Spin, Tooltip, Divider, Avatar } from '@arco-design/web-react';
import {
  IconMenu,
  IconLanguage,
  IconMoonFill,
  IconSunFill,
  IconSearch
} from '@arco-design/web-react/icon';
import {useHistory} from 'react-router-dom';
import styles from './style/index.module.less';
import useLocale from '@/utils/useLocale';
import { FormInstance } from '@arco-design/web-react/es/Form';
import apiClient from '@/utils/apiService';
import { GlobalContext } from '@/context';
import defaultLocale from '@/locale';
import { clearCookie } from '@/utils/useCookies'; // 导入函数


function Aisearch() {
  const TextArea = Input.TextArea;
  // 国际化
  const t = useLocale();
  // redux
  const { lang, setLang, theme, setTheme } = useContext(GlobalContext);

  // drawer
  const [visible, setVisible] = useState(false);

  // form ref
  const formRef = useRef<FormInstance>();


    // 推荐假数据
  const recdata = [
    { key: 'writer', title: 'AI写作', desc: '让写作变得简单, 快速, 有趣' },
    { key: 'poem', title: '诗人', desc: '为你写诗, 为你静止' },
    { key: 'toimage', title: '老马生图', desc: '老马不识途生图'  },
    { key: 'a', title: '图生文', desc: 'Image to Text' },
    { key: 'b', title: '图生图', desc: '兔兔图兔兔图图' },
    { key: 'c', title: '墨迹天气', desc: '天气查询体验' },
    { key: 'd', title: 'excel助手', desc: '帮你高效excel' },
    { key: 'e', title: 'AI知识库', desc: '帮你建设知识库' },
    { key: 'f', title: '旅游攻略', desc: '解放灵魂' },
  ]

  const colorlist = ['rgb(var(--blue-2))', 'rgb(var(--blue-2))', 'rgb(var(--gold-2))', 'rgb(var(--lime-2))', 'rgb(var(--blue-2))', 'rgb(var(--cyan-2))', 'rgb(var(--magenta-2))', 'rgb(var(--pinkpurple-2))']
  const colorindexfunc = (index) => {
    const colorindex = index % colorlist.length
    const color = colorlist[colorindex];
    const rgbaColor = color.replace('-2', '-1')

    return { color, rgbaColor }
  }
  
  const usrinputRef = useRef(null);
  const [usrinputvalue, setusrinputvalue] = useState('');

  const onchange=(value) => {
      // 当输入框内容发生变化时，更新状态
      setusrinputvalue(value)
  }

  const onsearch = () => {
    if (usrinputvalue) {
      history.push({
        pathname: '/aistudio',
        state: {e:usrinputvalue}
      });
    } else {
      Message.error(t['needcontent'])
    }
  
}

  const [recommend, setRecommend] = useState<string[]>([]);

  const searchdata = { key: 'search', title: 'AI搜索', desc: 'Ai搜索' }
  // 菜单假数据
  const menudata = [
    { key: 'writer', title: 'AI写作', desc: '让写作变得简单, 快速, 有趣' },
    { key: 'poem', title: '诗人', desc: '为你写诗, 为你静止' },
    { key: 'toimage', title: '老马生图', desc: '老马不识途生图' },
  ]

  const history = useHistory();

  function handleClick(e) {
    switch(e.key) {
    case 'writer':
      history.push({
        pathname: '/agent',
        state: { e }
      });
      break;
    case 'poem':
      history.push({
        pathname: '/agent',
        state: { e }
      });
      break;
    case 'toimage':
      history.push({
        pathname: '/agent',
        state: { e }
      });
      break;
    case 'search':
      setVisible(false);
      break;
    default:
      Message.error(t['indevelopment']) 
      console.log(`No matching route for key: ${e.key}`);
    break;
    }
  }

  const onUsrcenter = () => {
    history.push({
      pathname: '/usrcenter',
    });
  }

  const onExit = () => {
    // 清除 token
    clearCookie("token");
    // localStorage的userStatus登陆状态改为logout
    localStorage.setItem('userStatus', 'logout');
    // 清除userInfo
    localStorage.removeItem('userInfo');
    // 跳转到登录页
    history.push({
      pathname: '/login',
    });
  }

  // 测试方法
  const test =()=>{
    apiClient.post('/api/test', {}).then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log('请求成功:', res);
      }
    })
  }

  const currentLangRef = useRef(lang);
  useEffect(() => {
    if (currentLangRef.current !== lang) {
      currentLangRef.current = lang;
      const nextLang = defaultLocale[lang];
      Message.info(`${nextLang['message.lang.tips']}${lang}`);
    }
  },[lang])

  return (
    <div className={styles.container}>
      <div className={styles.aisearch_top}>
        <div className={styles.aisearch_top_menu}>
          <Button
            style={{ width: 30, height: 30, fontSize: 12 }}
            icon={<IconMenu />}
            onClick={() => {
              setVisible(true);
            }}
          />
        </div>
        <div className={styles.aisearch_top_settings}>
          <div className={styles.aisearch_top_settings_lang}>
            <Button
              icon={<IconLanguage />}
              onClick={() => {
                setLang(lang == 'en-US' ? 'zh-CN' : 'en-US');
              }}
            />
          </div>
          <div className={styles.aisearch_top_settings_theme}>
            <Button
              icon={theme !== 'dark' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </div>
        </div>
      </div>

        <Drawer
          width={240}
          height={332}
          title={<span>{t['aisearch.menu']}</span>}
          visible={visible}
          placement={'left'}
          onOk={() => {
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
          footer={null}
        >
          <div className={styles.aisearch_drawer}>

            <div className={styles.aisearch_drawer_top}>
              <div className={styles.aisearch_drawer_item} onClick={()=>handleClick(searchdata)}>
                <div className={styles.aisearch_drawer_item_icon}>
                  <IconSearch />
                </div>
                <div className={styles.aisearch_drawer_item_title}>
                  {t['aisearch.drawer.aisearch']}
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <h3>{t['aisearch.drawer.agents']}</h3>

              {menudata.map(item => (
                <div className={styles.aisearch_drawer_item} key={item.key} onClick={()=>handleClick(item)}>
                  <div className={styles.aisearch_drawer_item_icon}>
                    {item.title.slice(0, 1)}
                  </div>
                  <div className={styles.aisearch_drawer_item_title}>
                    {item.title}
                  </div>
                </div>
              ))
              }

            </div>

            <div className={styles.aisearch_drawer_bottom}>
              <div className={styles.aisearch_drawer_user} onClick={onUsrcenter}>
                <Avatar size={30}>
                  <img src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} alt="" />
                </Avatar>
                <div className={styles.aisearch_drawer_user_title}>
                  {t['aisearch.drawer.usrcenter']}
                </div>
              </div>
              <div className={styles.aisearch_drawer_exit} >
                  <Button
                    type='secondary'
                    onClick={onExit}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {t['aisearch.drawer.exit']}
                  </Button>
              </div>
            </div>
          </div>
        </Drawer>

      <div className={styles.aisearch_content}>

        {/* onClick={test} */}
        <div className={styles.aisearch_content_logo} > 
        </div>
        <div className={styles.aisearch_content_search}>
          <Form
            className={styles['login-form']}
            layout="vertical"
            ref={formRef}
            initialValues={{ search: '' }}
          >
            <Form.Item
              field="search"
            >
              <TextArea
                ref={usrinputRef}
                value={usrinputvalue}
                onChange={(value)=>{
                  onchange(value)
                }}
                placeholder="请输入您的问题"
                autoSize={{ minRows: 1, maxRows: 4 }}
                maxLength={600}
                showWordLimit
              />
            </Form.Item>

            <Form.Item
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
                      onsearch()
                    } catch (_) {
                      Message.error('Error！');
                    }
                  }
                }}
                type='primary'
                style={{ marginRight: 24 }}
              >
                {t['aisearch.search']}
              </Button>
              <Button
                onClick={() => {
                  formRef.current.resetFields();
                }}
              >
                {t['aisearch.reset']}
              </Button>
            </Form.Item>
          </Form>
        </div>


        <div className={styles.aisearch_content_recommend}>
          {recdata.map((item, index) => {
            const rescolor = colorindexfunc(index)
            return (
              <div key={index} className={styles.aisearch_content_recommend_div}
                style={{ background: `linear-gradient(0deg, ${rescolor.color} 0%, ${rescolor.rgbaColor} 100%)` }}
                onClick={()=>handleClick(item)}
              >

                <div className={styles.aisearch_content_recommend_div_top}>
                  <div className={styles.aisearch_content_recommend_div_logo}>
                    {item.title.slice(0, 1)}
                  </div>
                  <div className={styles.aisearch_content_recommend_div_title}>
                    {item.title}
                  </div>
                </div>
                <div className={styles.aisearch_content_recommend_div_mid}>
                  <div className={styles.aisearch_content_recommend_div_desc}>
                    {item.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.aisearch_footer}>
          版权所有 © 老王信息科技有限公司
          京公网安备11010100000001号 京ICP备08008888号-18
          安全评估备案号：Beijing-Aceberg-20240718
          网信算备110108604000000000001号
          京网文[2024]8888-188号 京ICP证080888号
          互联网药品信息服务资格证书：(京)-非经营性-2024-0008
        </div>
    </div>
  );
}

export default Aisearch;

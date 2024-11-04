from flask import Blueprint, render_template, request, jsonify
from utils.common import validate_token
import json
import requests
import os
from dotenv import load_dotenv

aiagent_blueprint = Blueprint("aiagent_module", __name__)

_ = load_dotenv(dotenv_path='aceberg.env') 
key = os.getenv('Key')
path = os.getenv('Path')
X_API_KEY = os.getenv('X_API_KEY')

os.environ["OPENAI_API_KEY"] = key
os.environ["OPENAI_API_PATH"] = path
os.environ["SERPER_API_KEY"] = X_API_KEY

from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_core.tools import Tool
from langchain import hub
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.output_parsers.json import SimpleJsonOutputParser
from openai import OpenAI

_ = load_dotenv(dotenv_path='aceberg.env') 
key = os.getenv('Key')
path = os.getenv('Path')



# ai搜索方法返回数据方法
global writerhistory
global poemhistory
writerhistory = []
poemhistory = []
def agent_aiagent(agenttype, input):
    client = OpenAI(api_key=key, base_url=path)

    if agenttype == 'writer':
        if len(writerhistory) < 10:
            writerhistory.append(
                {
                    'role': 'system',
                    'content': f'You are a writer, please write a wonderful article about the following topic:{input},It is best to limit the word count to no more than 300 words and answer based on the language input by the user'
                })
            writerhistory.append(
                {
                    'role': 'user',
                    'content': input
                }
            )
        else:
            writerhistory.pop(0)
        response = client.chat.completions.create(
            model='THUDM/glm-4-9b-chat',
            messages = writerhistory,
            stream=False,
            max_tokens=300,  # 限制回答的最大长度
            n=1,  # 生成一个回答
            stop=None,  # 不使用停止序列
            temperature=0.7
        )
    
        res = response.choices[0].message.content
        return res
        
    elif agenttype == 'poem':
        if len(poemhistory) < 10:
            poemhistory.append(
                {'role': 'system', 'content': f'You are a poem, please write a beautiful poem about the following topic:{input}'}
                )
            poemhistory.append({'role': 'user', 'content': input})
        else:
            poemhistory.pop(0)
        
        response = client.chat.completions.create(
            model='THUDM/glm-4-9b-chat',
            messages = poemhistory,
            stream=False,
            max_tokens=300,  # 限制回答的最大长度
            n=1,  # 生成一个回答
            stop=None,  # 不使用停止序列
            temperature=0.7
        )
        print(poemhistory)
        res = response.choices[0].message.content
        return res
        
    elif agenttype == 'toimage':

        url = "https://api.siliconflow.cn/v1/black-forest-labs/FLUX.1-schnell/text-to-image"

        payload = {
            "prompt": input,
            "image_size": "1024x1024",
            "num_inference_steps": 20
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": f"Bearer {key}"
        }

        res = requests.post(url, json=payload, headers=headers)
        print(res.json())
        return res.json()


# aistudio 组件里搜索返回值的接口
@aiagent_blueprint.route("/aiagent", methods=["POST"])
@validate_token
def aiagent():

    # 获取参数
    params = json.loads(request.data.decode("utf-8"))
    usrinput = params.get("usrinput", None)
    agenttype = params.get("agenttype", None)
    print(usrinput, agenttype)
    if usrinput and agenttype:
        try:
            res = agent_aiagent(agenttype, usrinput)
            
            response = jsonify({"msg": "", "status": "success", "data": res})
            response.status_code = 200
            response.headers["Content-Type"] = "application/json; charset=utf-8"
        except Exception as e:
            print(e)
            response = jsonify({"msg": str(e), "status": "error", "data": str(e)})
            response.status_code = 200
            response.headers["Content-Type"] = "application/json; charset=utf-8"
    else:
        response = jsonify({"msg": "请求参数有误", "status": "error", "data": "请求参数有误"})
        response.status_code = 200

    return response


# aistudio 组件里搜索返回值的接口
@aiagent_blueprint.route("/aiagent_removehistory", methods=["POST"])
@validate_token
def aiagent_removehistory():
    try:
        writerhistory.clear()
        poemhistory.clear()
        response = jsonify({"msg": "", "status": "success"})
        response.status_code = 200
        response.headers["Content-Type"] = "application/json; charset=utf-8"
    except Exception as e:
        print(e)
        response = jsonify({"msg": str(e), "status": "error", "data": str(e)})
        response.status_code = 200
        response.headers["Content-Type"] = "application/json; charset=utf-8"

    return response



# <img src="https://upload.wikimedia.org/wikipedia/en/d/d7/Shenzhen_University_Logo.svg" width=20> 项目说明

##### 技术栈：

![Static Badge](https://img.shields.io/badge/NextJS-blue?style=social&logo=nextdotjs&logoColor=%23000000)  ![Static Badge](https://img.shields.io/badge/FastAPI-blue?style=social&logo=fastapi&logoColor=%23009688)  ![Static Badge](https://img.shields.io/badge/TypeScript-blue?style=social&logo=typescript&logoColor=%233178C6)  ![Static Badge](https://img.shields.io/badge/SQLite-blue?style=social&logo=sqlite&logoColor=%23003B57)  ![Static Badge](https://img.shields.io/badge/Steam-blue?style=social&logo=steam&logoColor=%23000000)  ![Static Badge](https://img.shields.io/badge/TailwindCSS-blue?style=social&logo=tailwindcss&logoColor=%2306B6D4)  ![Static Badge](https://img.shields.io/badge/Redis-blue?style=social&logo=redis&logoColor=%23FF4438)  ![Static Badge](https://img.shields.io/badge/Nginx-blue?style=social&logo=nginx&logoColor=%23009688)  ![Static Badge](https://img.shields.io/badge/Docker-blue?style=social&logo=docker&logoColor=%23009688) 

# 自动构建流水线（适用Ubuntu）

克隆本项目并运行deploy-init.sh。

**注意：建议使用虚拟环境，该脚本会自动安装docker及其相关组件，虚拟环境需设置桥接网络模式**

```bash
git clone https://github.com/Bearisbug/SZU-Competition-Forum.git
cd SZU-Competition-Forum
sh ./Deploy/deploy-init.sh
```

执行完成后，docker将自动打包镜像并启动，可以在`./Deploy/build`找到打包完毕的前后端镜像。访问下方地址即可进入网站。目前仅使用HTTP访问，若需配置HTTPS+SSL证书，可以访问Let's Encrypt官网获取免费证书。

   ```text
   http://localhost/
   ```

# 手动构建

## 1. 克隆项目到本地

首先，克隆整个项目到本地：

```bash
git clone https://github.com/Bearisbug/SZU-Competition-Forum.git
cd SZU-Competition-Forum
```

## 2. 启动前端项目

前端使用 **Node.js** 和 **npm** 启动，确保你已经安装了 [Node.js](https://nodejs.org/)（包括 npm）。

1. **进入前端项目目录**：
   
   ```bash
   cd FrontEnd
   ```
2. **安装前端依赖**：
   
   执行以下命令来安装所有需要的前端依赖包：
   
   ```bash
   npm install
   ```
   
   这将根据 `package.json` 中列出的依赖来下载和安装所有所需的前端库。
3. **启动前端开发服务器**：
   
   安装完依赖后，启动前端开发服务器：
   
   ```bash
   npm run dev
   ```
   
   默认情况下，前端项目将会在 `localhost:3000` 启动。打开浏览器并访问以下地址：
   
   ```text
   http://localhost:3000
   ```
   
   你现在应该能够看到前端应用在浏览器中运行了。

## 3. 启动后端项目

后端使用 **FastAPI** ，在运行之前，请确保你已经安装了 [Python](https://www.python.org/)（推荐使用虚拟环境）。

1. **进入后端项目目录**：
   
   ```bash
   cd BackEnd
   ```
2. **安装后端依赖**：
   
   执行以下命令来安装后端所需的 Python 库：
   
   ```bash
   pip install -r requirements.txt
   ```
   
   这将自动从 `requirements.txt` 文件中读取依赖并安装相应的包。
3. **配置 FastAPI 启动脚本**：
   
   `在配置 FastAPI 启动脚本之前，请单独运行 app.db.models 文件，他将会生成一份 .db 文件，此文件即为 SQLite 数据库，将这份文件放在启动与你的启动脚本同级的目录下面，并确保在启动之前，你已经安装了 Redis 数据库。`
   
   FastAPI 应用通常会有一个启动脚本（比如 `main.py`），你需要确保在本地运行时能够启动 FastAPI。
   
   - 确保安装了 `uvicorn`，这是用于启动 FastAPI 应用的 ASGI 服务器：
     
     ```bash
     pip install uvicorn
     ```
   - 然后使用以下命令启动 FastAPI 后端：
     
     ```bash
     uvicorn main:app --reload
     ```
     
     - `main` 是你的 FastAPI 应用所在的 Python 文件名（不带 `.py` 后缀）。
     - `app` 是 FastAPI 实例化的对象，通常写作 `app = FastAPI()`。
     - `--reload` 选项表示开发模式下每次修改代码后自动重启服务器。
   
   启动后，你可以通过浏览器访问 `http://localhost:8000` 来访问后端 API，默认端口是 `8000`。

## 4. 前后端同时启动

确保前端和后端都已经成功启动后，整个项目就可以运行了：

- **前端**: 打开 `http://localhost:3000`，访问前端页面。
- **后端**: 打开 `http://localhost:8000/docs`，访问后端 API 文档。

确保前后端的接口能够正确连接。如果你在前端做了某些请求到后端，确保后端服务已经启动并且接口正确无误。

---

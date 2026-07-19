# 🐧 腾讯云北京服务器运维与部署手册 (Server Skills)

> 本文档记录了华寿微信客服机器人（`huashou-wecom-bot`）在腾讯云北京服务器上的配置、运行、及部署技能指令。
> 
> **💡 运维准则**：在配置、部署或添加新功能/新内容时，必须同步更新本文档，以保证服务信息的绝对准确和同步。

---

## ── 一、 服务器基础与登录凭证 ──

本服务器为目前的主力生产环境，基础运行环境已于 2026-06-11 配置就绪。

### 1. 服务器登录凭证
| 项目 | 值 | 说明 |
| :--- | :--- | :--- |
| **公网 IP** | `81.70.119.47` | 远程部署与外部 API 访问的公网 IP (腾讯云北京) |
| **用户名** | `ubuntu` | 运行账号（具有 sudo 及 docker 权限） |
| **密码** | `HSYZ@666888` | 用于 sudo 提权、ssh 登录等认证 |
| **项目路径** | `/home/ubuntu/huashou-wecom-bot` | 机器人服务器端根目录 |

### 2. 常用远程连接快捷指令 (本地终端执行)

> [!TIP]
> 您可以直接在本地终端复制并执行以下命令来连接或管理服务器。

```bash
# 1. 交互式登录服务器
ssh ubuntu@81.70.119.47
# (输入密码: HSYZ@666888)

# 2. 免输入密码交互式登录 (需安装 sshpass)
sshpass -p 'HSYZ@666888' ssh -o StrictHostKeyChecking=no ubuntu@81.70.119.47
```

---

## ── 二、 服务运行与进程管理 (PM2 & Docker) ──

机器人客服主程序使用 **PM2** 进行管理，Dify 平台及数据库依赖运行在 **Docker** 容器中。

### 1. 快捷运维指令 (本地一键执行)

| 运维操作 | 快捷指令 |
| :--- | :--- |
| **查看服务状态** | `sshpass -p 'HSYZ@666888' ssh -o StrictHostKeyChecking=no ubuntu@81.70.119.47 "pm2 list"` |
| **查看实时日志** | `sshpass -p 'HSYZ@666888' ssh -o StrictHostKeyChecking=no ubuntu@81.70.119.47 "pm2 logs huashou-kf --lines 50"` |
| **重启客服服务** | `sshpass -p 'HSYZ@666888' ssh -o StrictHostKeyChecking=no ubuntu@81.70.119.47 "pm2 restart huashou-kf"` |
| **停止客服服务** | `sshpass -p 'HSYZ@666888' ssh -o StrictHostKeyChecking=no ubuntu@81.70.119.47 "pm2 stop huashou-kf"` |
| **查看 Docker 容器** | `sshpass -p 'HSYZ@666888' ssh -o StrictHostKeyChecking=no ubuntu@81.70.119.47 "docker ps"` |

### 2. 服务运行状态参考
* **Dify AI 平台**: v1.14.2 (Docker Compose 运行于端口 `8080` / `8443`，已通过 Nginx 反向代理绑定至公网 **443** 端口，域名 **`bot.hszen.com`**)
* **Nginx 配置文件位置**: `/etc/nginx/sites-available/default` (已配置 Certbot SSL 工具，server_name 为 `bot.hszen.com`)

> [!WARNING]
> **网页控制台访问地址：`https://bot.hszen.com/`**（已验证可用）。
> - ❌ 不能用 IP `http://81.70.119.47/` 直连：nginx 按域名 `bot.hszen.com` 做虚拟主机路由，IP 直连会返回 404。
> - ❌ 聊天里提到的 `bothszzen.com` 是**无效旧域名**（DNS 解析不到服务器），请勿使用。
> - 🔐 控制台需账号登录（邮箱 + 密码），并非 SSH 密码；登录账号由管理员绑定，详见微信沟通。

---

## ── 三、 数据库与缓存实例 ──

> [!WARNING]
> 数据库的密码为 `difyai123456`，请勿泄露。生产环境的数据库与缓存仅对本地/内部容器开放，公网无法直接连接。

### 1. 实例连接配置
* **Redis** (本地运行)：
  * 连接地址：`redis://:difyai123456@127.0.0.1:6379/0`
  * 密码：`difyai123456`
* **PostgreSQL** (本地运行)：
  * 连接地址：`postgresql+asyncpg://postgres:difyai123456@127.0.0.1:5432/huashou_bot`
  * 用户名/密码：`postgres` / `difyai123456`
  * 数据库名：`huashou_bot`
* **Dify 数据库** (容器内独立运行，不对公网开放)：
  * PostgreSQL 容器：`dify-db_postgres-1` (挂载至本地)
  * Redis 容器：`dify-redis-1` (挂载至本地)

### 2. 数据库快速查询 (本地终端一键执行)

```bash
# 1. 登录服务器 PostgreSQL 数据库命令行
sshpass -p 'HSYZ@666888' ssh -t ubuntu@81.70.119.47 "docker exec -it dify-db_postgres-1 psql -U postgres -d huashou_bot"

# 2. 查看客服会话消息记录 (最后10条)
sshpass -p 'HSYZ@666888' ssh ubuntu@81.70.119.47 "docker exec -i dify-db_postgres-1 psql -U postgres -d huashou_bot -c 'SELECT sender, content, created_at FROM user_messages ORDER BY created_at DESC LIMIT 10;'"
```

---

## ── 四、 代码同步与一键部署 (deploy.sh) ──

我们已经更新了本地的部署脚本 `scripts/deploy.sh`，使其完全适配新的腾讯云北京服务器。

### 1. 一键部署流程 (本地执行)

在本地开发目录（`huashou-wecom-bot`）下执行：

```bash
# 1. 确保部署脚本有执行权限
chmod +x scripts/deploy.sh

# 2. 执行部署脚本 (自动同步代码、更新依赖、重启 PM2 并自动更新服务器 Skills 说明文档)
./scripts/deploy.sh
```

### 2. 部署脚本核心逻辑说明

部署脚本执行时，会自动执行以下操作：
1. **自动同步**：通过 `rsync` 自动同步本地代码到 `/home/ubuntu/huashou-wecom-bot/`，自动排除 `.venv`、`__pycache__` 等无用文件。
2. **文档同步**：同步前会自动将此 `服务器skills.md` 复制到项目目录中的 `SKILL.md`，从而将其一并部署到服务器上，保证两端文档的绝对同步。
3. **依赖安装**：在服务器上自动执行 `pip install -r requirements.txt`。
4. **服务重启**：自动执行 `pm2 restart huashou-kf` 重启客服服务。
5. **服务验证**：通过 `curl` 自动验证接口是否健康。

--- 

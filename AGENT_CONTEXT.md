# 项目上下文

## 基本信息
- 项目名称：签到日历系统（signin-calendar）
- 项目目录：/Users/tanjun/hermes_agent/signin-calendar
- 创建时间：2026-06-29
- 当前状态：review_passed（待测试）

## GitHub 配置
- 用户名：deepgreenuniverse
- 仓库：signin-calendar（已存在）
- Token：ghp_...（保存在 ~/.hermes/.gh_token）
- 代码已推送至 main 分支

## 原始需求
用户想试试手，跑一个签到日历系统。系统需要记录用户每日的签到情况，以日历形式展示连续签到天数/断签情况，并支持基本的签到统计。

## 完整要求
1. 给出技术栈建议
2. 设计数据模型（签到记录怎么存）
3. 设计 API 接口（签到、获取签到状态/统计）
4. 给出页面原型/交互说明
5. 代码完成后需推送到 GitHub，并提供可访问的地址

## 协作链路
PM（紫月）→ Plan（安妙依）→ Dev（叶凡）→ Plan（code review）→ 紫月 → 秦瑶（测试）→ 汇总

## dev_output
### 已完成内容

**后端（Node.js + Express + SQLite）：**
- `backend/src/index.js` - Express 服务入口，端口 3001，CORS 已配置
- `backend/src/db/database.js` - SQLite 初始化，自动创建 default_user
- `backend/src/db/schema.sql` - 表结构：user、signin_record
- `backend/src/routes/signin.js` - 4个 API：
  - POST /api/signin - 签到（防重）
  - GET /api/signin/status - 今日状态
  - GET /api/signin/stats - 统计（total/currentStreak/longestStreak）
  - GET /api/signin/calendar?month=YYYY-MM - 月历

**前端（React + Vite + TailwindCSS）：**
- `src/services/api.js` - API 调用层（fetch）
- `src/services/signinService.js` - 业务逻辑层，对接后端 API
- `src/components/SigninCalendar.jsx` - 主组件
- `src/components/CalendarView.jsx` - 日历视图（月份切换）
- `src/components/StatsCard.jsx` - 统计卡片
- `src/components/SigninButton.jsx` - 签到按钮
- `src/components/Toast.jsx` - Toast 提示
- `src/utils/dateUtils.js` - 日期工具函数

**自测结果：**
- 后端 API 全部通过（health、signin、status、stats、calendar、duplicate）
- 前端构建成功（vite build）
- GitHub 推送成功

**待完成：**
- 前端部署（GitHub Pages）
- 后端部署（Railway 或 Render）

### 本地预览
- 前端：http://localhost:5173（dev server）
- 后端：http://localhost:3001

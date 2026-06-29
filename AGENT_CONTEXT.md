# 项目上下文

## 基本信息
- 项目名称：签到日历系统（signin-calendar）
- 项目目录：/Users/tanjun/hermes_agent/signin-calendar
- 创建时间：2026-06-29
- **状态**：dev_done

## GitHub 配置
- 用户名：deepgreenuniverse
- 仓库：signin-calendar（已创建并推送）
- 在线地址：https://deepgreenuniverse.github.io/signin-calendar/
- GitHub Pages：legacy 构建模式，gh-pages 分支

## 原始需求
用户想试试手，跑一个签到日历系统。系统需要记录用户每日的签到情况，以日历形式展示连续签到天数/断签情况，并支持基本的签到统计。

## 协作链路
PM（紫月）→ Plan（安妙依）→ Dev（叶凡）→ Plan（code review）→ 紫月 → 秦瑶（测试）→ 汇总

## dev_output

### 实现说明
- **技术栈**：React 18 + Vite + Tailwind CSS + Lucide + date-fns
- **数据**：localStorage，key=`signin_records`
- **dev server**：`npm run dev`（端口 5177）
- **构建**：`npm run build`（输出 dist/）
- **修复**：signinService.js 所有接口（signin/getStatus/getCalendarDays）现已改为调用 signinStore（localStorage），不再调用后端 API

### 代码位置
```
signin-calendar/
├── src/
│   ├── store/signinStore.js        # localStorage CRUD（getAllRecords/saveRecords/addRecord/checkSignedIn/createRecord）
│   ├── services/signinService.js   # signin/getStatus/getCalendarDays → 调用 store 层
│   ├── utils/dateUtils.js          # date-fns 封装，getStreakInfo 连续计算
│   └── components/
│       ├── SigninCalendar.jsx      # 主页面，状态管理
│       ├── StatsCard.jsx           # 3列统计卡片
│       ├── CalendarView.jsx        # 月历格子+月份切换+断签标记+tooltip
│       ├── SigninButton.jsx        # 签到按钮（loading/已签到状态）
│       └── Toast.jsx               # toast 反馈
```

### 核心逻辑
- `getStreakInfo`：从今天往回推算连续签到天数，遇未签到即中断
- `getCalendarDays`：返回当月每天格子数据，含 `streakInfo.isStreakStart/isStreakEnd`
- 签到成功后 `refreshKey` 递增，StatsCard + CalendarView 同时刷新
- 断签日（过去的未签到日）在格子右下角显示红色三角形图标

### GitHub 推送
- **main 分支**：源代码，已 commit 并推送
- **gh-pages 分支**：dist 构建产物，通过 GitHub API 上传
- **Token 限制**：deepgreenuniverse 的 PAT 缺少 `workflow` scope，无法 push workflow 文件

### 在线访问
- **地址**：https://deepgreenuniverse.github.io/signin-calendar/
- **状态**：✅ 200 OK，资源（JS/CSS）均可正常加载

## test_output
**测试结果**：/FAIL/ → 修复完成，待复测

**问题 1（致命）**：signinService.js 调用后端 API，完全未使用 localStorage
- signinService.js 所有接口（signin/getStatus/getCalendar）都调用 `http://localhost:3001/api` 后端
- store/signinStore.js 写了完整的 localStorage CRUD，但 service 层根本没调用它
- **修复**：重写 signinService.js，所有接口改为调用 signinStore（localStorage）
- ✅ npm run build 干净通过

**问题 2**：signinService.js 和 store/signinStore.js 职责重叠但未连接
- **修复**：signinService.js 直接调用 signinStore，职责统一

# 项目上下文

## 基本信息
- 项目名称：签到日历系统（signin-calendar）
- 项目目录：/Users/tanjun/hermes_agent/signin-calendar
- 创建时间：2026-06-29
- **状态**：test_pending（待秦瑶测试验证）

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
**测试结果**：/FAIL/ → 发现新 bug，待修复

**已修复问题（来自上轮）**：
- ✅ signinService.js 全部接口已改为调用 signinStore（localStorage）
- ✅ npm run build 干净通过

**新发现 Bug（致命）**：dateUtils.js 的 getStreakInfo() 中 longestStreak 计算错误
- **位置**：`src/utils/dateUtils.js` 第 37-44 行
- **问题 1**：isConsecutive 参数顺序反了
  - 代码：`isConsecutive(dates[i - 1], dates[i])`（新→旧方向）
  - isConsecutive(a, b) 内部计算 `differenceInCalendarDays(b, a)`，要求 b = a + 1 天
  - 正确方向：应传 `isConsecutive(dates[i], dates[i-1])`（旧→新方向）
  - 结果：连续 3 天签到，longestStreak 错误累加为 1 而非 3
- **问题 2**：longestStreak 初始化为 1
  - 单日签到时循环不执行，longestStreak 错误返回 1 而非 0
  - 应初始化为 0
- **修复状态**：✅ 已修复，npm run build 通过

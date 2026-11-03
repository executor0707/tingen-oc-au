# 诡秘之主：廷根异闻

OC AU 单机大世界沙盒的**三段垂直切片**：廷根 30 天 + 贝克兰德 14 天 + 海上 10 天。

## 现在能玩什么

- 捏人：5 出身、4 条序列 9 途径、5 缺陷、5 初始人脉、5 种外观
- 廷根 6 个地点：水仙花街、黑荆棘、占卜俱乐部、疯人院、码头区、圣赛琳娜教堂
- 贝克兰德 6 个地点：东区出租屋、莫里亚蒂侦探所、皇后区、码头、黑夜教堂、贝克兰德大学
- 海上 5 个地点：罗思德港、幽蓝复仇者号、黑市、无人岛、风暴眼
- 每天 2 个行动点；三地 40+ 地点行动；30 个街角事件
- 每日报纸：canon 行踪 / 玩家影响 / 市井传闻
- 30 个 canon 锚点（廷根 12 + 贝克兰德 12 + 海上 6）；可旁观、接触、介入
- 22 个委托；15 个 NPC 关系
- 廷根第 30 天可去贝克兰德，贝克兰德第 14 天可出海
- 结局：24 个普通人 + 9 个核心 + 3 个坏结局，按条件出现
- 档案库：结局档案、110 个八部 canon 锚点、人物档案
- 自动档 + 3 个手动档；导出/导入 JSON；移动端可用

## 运行

```powershell
python -m http.server 4180 --directory build/app
```

打开 <http://127.0.0.1:4180/>。

Pages 构建：

```powershell
python -m http.server 4181 --directory build/pages
```

## 数据

- `build/app/data/world/canon_events.js`：110 个 canon 锚点（廷根 12 个用于切片）
- `build/app/data/world/game_data.js`：出身/途径/地点/委托/事件/结局
- `design/CANON_EVENTS.md`：可读的事件表
- `design/ENDINGS.md`：结局矩阵
- `PRODUCT_BRIEF.md`：产品边界

canon 锚点使用原创转述，不包含原作长段正文；Pages 构建与本地玩法一致。

## QA

```powershell
node qa/verify.mjs      # 结构化 19 项
node qa/loop.mjs        # 廷根 30 天完整循环 + 第 30 天结局
node qa/backlund.mjs    # 廷根 → 贝克兰德转场 + 贝克兰德 14 天结局
node qa/sea.mjs         # 海上 10 天 + 海上结局
node qa/archive.mjs     # 结局档案 + 110 canon 总表 + 人物档案
```

结果见 `qa/verification.json`、`qa/loop_result.json`、`qa/backlund_result.json`、`qa/sea_result.json`、`qa/archive_result.json` 与 `qa/evidence/`。

## 边界

非官方、非商业同人。原作与设定归爱潜水的乌贼及相关权利方所有。存档只在本机；Pages 版本不含原作长段正文。

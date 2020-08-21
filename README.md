# Calendar 日历

## Calendar 是 Vant小程序组件库 的修改版本，单纯为了开发日历组件。

## 引入
- 只需要在app.json或index.json中配置 Calendar 对应的路径即可
```
// index.json
{
  "usingComponents": {
    "calendar": "../../components/calendar/index"
  }
}
```

## 代码演示
```
<calendar
  min-date="{{ minDate }}"
  max-date="{{ maxDate }}"
  default-date="{{date}}"
/>

Page({
  data: {
    minDate: new Date("2020/08/01").getTime(),
    maxDate: new Date("2020/11/30").getTime(),
    date: [
      {
        start: new Date("2020/08/05").getTime(),
        end: new Date("2020/08/20").getTime(),
        remark: "拆墙改造",
        color: "#215a9d"
      },
      {
        start: new Date("2020/09/01").getTime(),
        end: new Date("2020/09/15").getTime(),
        remark: "水电空调",
        color: "#3db678"
      },
      {
        start: new Date("2020/09/21").getTime(),
        end: new Date("2020/09/29").getTime(),
        remark: "木土瓦工",
        color: "#008b8b"
      },
      {
        start: new Date("2020/10/02").getTime(),
        end: new Date("2020/10/22").getTime(),
        remark: "油漆工程",
        color: "#2a7d81"
      },
      {
        start: new Date("2020/11/2").getTime(),
        end: new Date("2020/11/19").getTime(),
        remark: "补漆保护"
      }
    ]
  }
})
```

## Props
| 参数 | 说明 | 类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| title | 日历标题 | string | - |
| min-date | 可选择的最小日期 | number | 当前日期 |
| max-date | 可选择的最大日期 | number | 当前日期的六个月后 |
| default-date | 默认选中的日期 | Object | Array[] | - |
| row-height | 日期行高 | number | string | 64 |
| show-mark | 是否显示月份背景水印 | boolean | true |
| show-title | 是否展示日历标题 | boolean | true |
| formatter | 日期格式化函数 | (day: Day) => Day | - |

## Formatter日期格式化演示
```
<calendar
  formatter="{{ formatter }}"
/>

Page({
  data: {
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      if (month === 8) {
        if (date === 1) {
          day.topInfo = '建军节';
        } else if (date === 7) {
          day.topInfo = '立秋';
        } else if (date === 25) {
          day.topInfo = '七夕';
        } else if (date === 28) {
          day.text = '今天';
        }
      }
      if (day.type === 'end') {
        day.bottomInfo = '完工';
      }
      return day;
    },
  }
})
```

## Day 数据结构
| 键名 | 说明 | 类型 |
| :--- | :--- | :--- |
| date | 日期对应的 Date 对象 | Date |
| type | 日期类型，可选值为selected、start、middle、end、disabled | string |
| text | 中间显示的文字 | string |
| topInfo | 上方的提示信息 | string |
| bottomInfo | 下方的提示信息 | string |

## Default-date 数据结构(Array)
| 键名 | 说明 | 类型 |
| :--- | :--- | :--- |
| start | 日期起始时间 | number |
| end | 日期结束时间 | number |
| remark | 日期起始备注 | string |
| color | 颜色 | string |

### 注意事项
- 日期结束备注可通过 formatter 函数判断 type 为 end 改变 bottomInfo
- Default-date 数组内日期不可重复，时间段不可重叠；为了减少复杂度建议按从小至大排列


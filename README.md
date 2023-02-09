# Sidoc Demo

### [Sidoc下载地址](http://www.edithops.com/downloads/sidoc/)

## Sidoc 生成报告所需内容

- 数据源（Json 或 Edith 自定义格式）
- 规则（JavaScript 代码）
- 配置文件（为规则提供配置信息）
- 文档模板（Markdown、Doc）
- 署名（Json 格式，涵盖生成文档的出处、服务人员和服务对象等）

以上内容组成的整体，称为 **Sidoc 模板（Template）**

### 数据源自定义

```bash
./.sidoc/data/filetype.id.hostname.datetime.json
```

作为一个普遍的文档格式，Json 文档是 Sidoc 生成报告的主要数据来源。
任何 Json 格式的数据皆可作为数据源传入 Sidoc。

### 规则自定义

```bash
./.sidoc/rules/ruletype.rulename.js
```

Sidoc 生成的报告内容不仅包括对数据的展示，还可以对指定数据进行处理。
例如，用户指定阈值，并在规则里编写判断逻辑，即可通过 Sidoc 的解析，对同一指标有不同的展示形式。

### 配置文件自定义

当用户在不同环境下使用同一模板时，可以通过配置文件控制每个规则的开启和关闭，也可以向规则内传入其他指标的值完成跨指标对比。
同时，配置文件还支持自定义规则路径，从而让模板变得更通用。

### 文档模板自定义

清晰的逻辑、数值可以体现报告的专业性，而规整的排版格式、丰富的文档类型支持向 Sidoc 生成的报告注入了一份优雅。
Sidoc 不仅支持 Markdown 语法，还可以集成 Pandoc 生成 Doc 文档。
用户自定义 Doc 文档的各类封面、目录以及标题等内容的格式，让报告变得更加美观。

### 署名自定义

对于一份具有服务性质的报告来说，不仅需要在报告内体现作者等提供服务方的信息，还要有服务对象等关键字的展示。
通过修改 Sidoc 的署名配置文件即可实现上述内容。而对于批量生成的报告来说，还可以通过自定义该配置内容使输出的报告文档文件名更加规范。

## 示例解析

### 数据源

```bash
./.sidoc/data/TestStatus.test.echo.20220712163947.json
```

```json
{
  "check": [
    {
      "metric": [
        {
          "item1": 100
        },
        {
          "item2": 3
        }
      ],
      "datetime": "2022-07-12 16:39:47"
    }
  ]
}
```

### 规则

```bash
./.sidoc/rules/test.rule.js
```

```javascript
; (function (input) {
    var results = []
    var result = {
        id: "test.check.term",
        name: "test check term",
        actual: [],
        family: "status"
    }

    if (!input) {
        result.actual = "内容为空"
        return { results: [result] }
    }

    for (var i = 0; i < input[0]["metric"].length; i++) {
        if (Object.values(input[0]["metric"][i])[0] > 50) {
            var tmp = {
                "name":Object.keys(input[0]["metric"][i])[0],
                "value":Object.values(input[0]["metric"][i])[0],
                "status":"存在安全隐患，请及时查看"
            }
            result.actual.push(tmp)
        } else {
            var tmp = {
                "name":Object.keys(input[0]["metric"][i])[0],
                "value":Object.values(input[0]["metric"][i])[0],
                "status":"该指标状态正常"
            }
            result.actual.push(tmp)
        }
    }

    results.push(result)
    return { results: results }

})(input)
```

### 配置文件

```bash
./.sidoc/check-config.json
```

```json
{
    "checks": [
        {
            "expr": "//TestStatus/*/check", 
            "rule": "test.rule",
            "params": [
                {
                    "key": "_scope",
                    "value": "check"
                },
                {
                    "key": "_name",
                    "expr": "../host/hostname"
                },
                {
                    "key": "_iid",
                    "expr": "../edith/flags/path"
                }
            ]
        }
    ],
    "rulesDir": "./rules"
}
```

### 文档模板

文档模板内容的修改仅涉及 Doc 文档的观赏性，不影响数据生成

```bash
./.sidoc/template.docx
```

### 署名

```bash
./single.sidoc
```

```json
{
  "datadir": "./data",
  "groupby": "instance",
  "id": "test",
  "latest": true,
  "meta": {
    "author": {
      "email": "test@email.com",
      "name": "test name"
    },
    "customer": "test customer",
    "date": "",
    "org": "Test 公司",
    "title": "Test 报告",
    "config": {
      "appnames":{}
    }
  },
  "output": "reports/{{customer}} - {{instance}}@{{hostname}} - Test报告 - {{yymmdd}}"
}
```
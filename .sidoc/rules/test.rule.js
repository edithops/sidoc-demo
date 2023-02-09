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

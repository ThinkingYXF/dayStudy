$(document).ready(function () {
    //表格初始化
    var table = $("#tableTest").css('minWidth','500px').DataTable({
        "info": false,
        "filter": false,
        "paging": false,
        "scrollY":300,
        "scrollCollapse":true,
        'scrollX': true,
        'order': [[0, 'desc'], [3, 'asc'], [5, 'asc']],
    });

    //点击添加两行
    var num = 1007;
    // $('.add').on("click", function () {

    // })
    $(".add").click(function () {
        table.row.add([num, "abc", 25, "tt", "TT", 350, "high"]);
        // table.row.add(["", "", "", "", "", ""]);
        table.row.add([num + 1, "bcd", 10, "qq", "QQ", 600, "higher"]).draw();
        num+=2;
        // table.addRows([],2);
        return false;
    });
})
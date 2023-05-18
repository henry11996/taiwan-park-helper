import XLSX from "xlsx";
import { reactive, ref, watch } from "vue";

export const useMemberFileUpload = () => {
    let data = reactive({
        members: {},
    });
    let options = reactive({
        key: "信箱",
        fixPhoneNumber: true,
    });
    const files = ref([]);
    const alert = reactive({
        type: "info",
        show: true,
        message: "等待上傳中...",
    });

    const xlsxToArray = (data, key) => {
        const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: true,
            dateNF: "yyyy-mm-dd",
        });
        const rows = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]], { raw: false }
        );

        return rows.reduce(function (r, e) {
            r[e[key]] = e;
            return r;
        }, {});
    };

    watch(files, async (files) => {
        files.forEach(async (file) => {
            try {
                const buffer = await file.arrayBuffer();
                data.members = xlsxToArray(buffer, options.key);
                console.log(data.members);
                alert.type = "success";
                alert.message = "成功，找到 " + Object.keys(data.members).length + " 筆隊員資料";
                alert.show = true;
            } catch (error) {
                alert.type = "error";
                alert.message = "上傳失敗：" + error.message;
                alert.show = true;
            }
        });
    });

    return {
        files,
        data,
        alert,
        options
    };
}
console.log("members loaded")

var members = {}
const memberKey = '身分證字號'
const injectSelectorIds = ['member', 'ContentPlaceHolder1_applydiv', 'ContentPlaceHolder1_upLeader']

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("member received")
  members = message.members
  removeSelectors()
  injectSelectors(message.members)
  sendResponse({ message: "message received" })
})

function removeSelectors() {
  injectSelectorIds.forEach((id) => {
    if ($('body').has(`#${id}`)) {
      const target = $('body').find(`div[id^='${id}']`)
      if (id == 'member') {
        target.find('div#inject-selector-div').remove()
      } else if (id == 'ContentPlaceHolder1_applydiv') {
        target.find('div#inject-selector-applier-div').remove()
      } else if (id == 'ContentPlaceHolder1_upLeader') {
        target.find('div#inject-selector-leader-div').remove()
      }
    }
  })
}

function injectSelectors(members) {
  injectSelectorIds.forEach((id) => {
    if ($('body').has(`#${id}`)) {
      const target = $('body').find(`div[id^='${id}']`)
      if (id == 'member' && !$('div#inject-selector-div').length) {
        target.find('div.panel-body').prepend(autoSelector(members, 'inject-selector'))
        $("select[id^='inject-selector']").on('change', function (e) {
          console.log('member ' + e.target.value)
          autoFill(e, members, '.panel-body')
        })
      } else if (id == 'ContentPlaceHolder1_applydiv' && !$('div#inject-selector-applier-div').length) {
        target.prepend(autoSelector(members, 'inject-selector-applier'))
        $("select[id^='inject-selector-applier']").on('change', function (e) {
          console.log('apply ' + e.target.value)
          autoFill(e, members, '.panel-body')
        })
      } else if (id == 'ContentPlaceHolder1_upLeader' && !$('div#inject-selector-leader-div').length) {
        $(autoSelector(members, 'inject-selector-leader')).insertAfter("#ContentPlaceHolder1_upLeader .checkbox")
        $("select[id^='inject-selector-leader']").on('change', function (e) {
          console.log('leader ' + e.target.value)
          autoFill(e, members, '.panel-body')
        })
      }
    }
  })
}

function autoFill(e, members, parentFormClass) {
  const member = members[e.target.value]
  const form = $(e.target).parents(parentFormClass).first()
  form.find('input[name$="name"]').val(member['姓名'])
  form.find('input[name$="tel"]').val(member['電話'].trim() == "" ? member['手機'] : member['電話'])
  form.find('input[name$="addr"]').val(member['地址'])
  form.find('input[name$="mobile"]').val(member['手機'])
  form.find('input[name$="email"]').val(member['信箱'])
  form.find('select[name$="nation"]').val(member['國籍'])
  form.find('input[name$="sid"]').val(member['身分證字號'])
  form.find('select[name$="sex"]').val(member['性別'])
  form.find('input[name$="birthday"]').val(member['生日'])
  form.find('input[name$="contactname"]').val(member['緊急聯絡人'])
  form.find('input[name$="contacttel"]').val(member['緊急聯絡人手機'])
  form.find('input[name$="sid"]').trigger('focus')
}

function autoSelector(members, id = 'inject-selector') {
  const options = Object.values(members)

  return `<div class="form-group form-inline" id="${id}-div">
    <label class="col-sm-2 control-label">
      <span class="REDWD_b">自動填入</span>
    </label>
    <div class="col-sm-10">
      <select 
              id="${id}" 
              class="form-control" 
      >
        <option selected="selected" value="">請選擇</option>
      `
    + options.map((option) => `<option value="${option[memberKey]}">${option['姓名']}</option>`).join('\n') +
    `
      </select>
    </div>
  </div>
  `
}

function xlsxToArray(data, key) {
  const workbook = XLSX.read(data, {
    type: "binary",
    cellDates: true,
    dateNF: "yyyy-mm-dd",
  });
  const rows = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]], { raw: false }
  );
  rows.shift() //移除範例
  return rows.reduce(function (r, e) {
    r[e[key]] = e;
    return r;
  }, {});
};

// 儲存範例檔用
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

//等待元素出現
waitForElm('div#accordion').then(e => {
  const block = $("<div></div>")
    .addClass("panel")
    .css("background-color", "#390")
    .css("padding", "10px")
    .css("margin-top", "13px")
    .css("border", "10px solid darkorange")
    .insertAfter("div#ContentPlaceHolder1_upStep21")

  const panel = $("<div></div>")
    .css("display", "flex")
    .css("justify-content", "space-between")
    .appendTo(block)

  const readme = $("<div></div>")
    .css("color", "#fff")
    .css("width", "100%")
    .appendTo(panel)

  const xlsxFile = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,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oZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZeUoZfY58ZjHxzPfXI81bmwz47HPjwe+/R47OPjsc+Pxz5AnjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0kjL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0ijL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0mjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0hjL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0ljL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0jjL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0njL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0gTL0YnBwRH88vy/Ldli0xdnJQ9nclW/KyWQexz9Ou4z9rWivKW9P+9fi1bXsH8dnvgw/OxnHCf5QTKr4taqnm+fLfnqpV0wm9fPrSTH9uF5s2TR18779NClP+3Ers7j8WdkUbR0r8qFsn8ty2u/N7+vnYVPPhvXzy9a74Hn37K/L+by4K9czdvGL6eyx3cTXT/husYehfDXsQGj7aRavTap5G9d5Gwv+OCnE2V9/91i3v/rvf/jzL378lz8tH5wcb66ux8mzwSYqYzV2t/n/ctuv5avX/9e2//M//vV//u7f/uvf//7Hf/rjL+I/P/7zP/7FJUgC8TaZNdW0fTdb3iP3ZTGupnfzzTLvmmp8HW/bPZH35ebevq+b6od62haTN+W0LZuXe7r3VDZtdZNfiHfrLNbj66K5q2LiSXkbZxscOe2CsOs/scs1y5+hPVfi+XTx+IJ5IN36T2xPH+o2/vDtvdRtr2y6S0YIL8RAKivloPv/nbd13e6/tFpp3O7jrDcr4g3xvvohHlZsSPO4sXLRI+IEVftN/W01bu+7n9Hlw3UHiI+7Kd41i+zjeON8c19O38XaxDusqWJpFqdx2p/VTdsUVRt3MSluPv5mOv72vmpf7ppxU9y+NKCb+IP+pn54iM+P5zOtpztHMZxVp33VLW19Bi+Rm3pWdWcqut0tq/J2UYDeuLq9jec0bd9Wzfwl1Sb8bjw+f3ppdWcn9Xg8WkwQb66t7+O3yxmX4c3328niw+e6+bhod2f/C1BLBwjsE1cy6xMAAKDzAQBQSwECFAAUAAgICABxfLBWZqqCt+AAAAA7AgAACwAAAAAAAAAAAAAAAAAAAAAAX3JlbHMvLnJlbHNQSwECFAAUAAgICABxfLBW9GL+BxICAAB5AwAADwAAAAAAAAAAAAAAAAAZAQAAeGwvd29ya2Jvb2sueG1sUEsBAhQAFAAICAgAcXywVmnv3RFtBAAAYy8AAA0AAAAAAAAAAAAAAAAAaAMAAHhsL3N0eWxlcy54bWxQSwECFAAUAAgICABxfLBWT/D5etIAAAAlAgAAGgAAAAAAAAAAAAAAAAAQCAAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHNQSwECFAAUAAgICABxfLBWN70hpiwCAABuBwAAFAAAAAAAAAAAAAAAAAAqCQAAeGwvc2hhcmVkU3RyaW5ncy54bWxQSwECFAAUAAgICABxfLBWxoAh21UBAACMAgAAEQAAAAAAAAAAAAAAAACYCwAAZG9jUHJvcHMvY29yZS54bWxQSwECFAAUAAgICABxfLBWj5kUBBEBAAC5AQAAEAAAAAAAAAAAAAAAAAAsDQAAZG9jUHJvcHMvYXBwLnhtbFBLAQIUABQACAgIAHF8sFbcBLUxWgEAAFcFAAATAAAAAAAAAAAAAAAAAHsOAABbQ29udGVudF9UeXBlc10ueG1sUEsBAhQAFAAICAgAcXywVuwTVzLrEwAAoPMBABgAAAAAAAAAAAAAAAAAFhAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLBQYAAAAACQAJAD8CAABHJAAAAAA="

  $("<p></p>").text("1. 下載人員範例檔，並依照範例檔格式填寫人員資料").appendTo(readme)
  const link = $("<p></p>").text("2. ").appendTo(readme)
  $("<a></a>").text("點此下載檔案").attr("download", "登山人員範例檔.xlsx").attr("target", "__blank").css("color", "#0000cc").attr("href", xlsxFile).appendTo(link)
  $("<p></p>").text("(注意：請勿修改範例檔欄位名稱)").addClass("REDWD_b").appendTo(readme)
  $("<p></p>").text("3. 點選右邊的上傳，並選擇填寫完畢的檔案").appendTo(readme)
  $("<p></p>").text("4. 檔案上傳成功後，即可在姓名欄位上方看到自動填入選項").appendTo(readme)
  $("<p></p>").text("5. 如果要修改自動填入的資料，可直接修改或重新上傳").appendTo(readme)

  const label = $("<label></label>")
    .attr("for", "member-file-upload")
    .css("border", "3px dashed #ccc")
    .css("display", "flex")
    .css("padding", "6px 12px")
    .css("cursor", "pointer")
    .css("color", "#fff")
    .css("font-weight", "400")
    .css("width", "100%")
    .css("justify-content", "center")
    .appendTo(panel)
  $("<p></p>").css("align-self", "center").text("點此上傳人員檔案").appendTo(label)

  $("<input></input>").attr("type", "file")
    .attr("id", "member-file-upload")
    .css("display", "none")
    .addClass("BUTTON_back")
    .appendTo(panel)

  $('#member-file-upload').on('change', async function (e) {
    if (e.target.value == '') return
    const file = e.target.files[0]
    // toBase64(file).then((res) => {
    //   console.log(res)
    // })
    if (file.size > 1024 * 30) {
      alert('檔案大小不能超過 30KB');
      return;
    }
    const buffer = await file.arrayBuffer();
    members = xlsxToArray(buffer, memberKey);
    console.log(members);
    removeSelectors()
    injectSelectors(members)
    e.target.value = ''
    alert('上傳成功')
  })

  $("<p></p>")
    .css("color", "bisque")
    .css("text-align", "center")
    .css("margin", "10px 0 0 0")
    .text("** 此區塊由擴充功能 Climber 提供 **").appendTo(block)

  // 建立循環監聽
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver
  var observer = new MutationObserver(function (mutations, observer) {
    injectSelectors(members)
  })

  observer.observe(document.getElementById('accordion'), {
    subtree: true,
    attributes: true,
    childList: true,
  })
})

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true
    });
  });
}
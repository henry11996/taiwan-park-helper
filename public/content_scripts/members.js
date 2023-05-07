// $("input[checked='unchecked']#ContentPlaceHolder1_applycheck").load().trigger("click")
console.log("members loaded")

// var button = document.createElement("Button")
// button.innerHTML = "Title"
// button.style = "top:0;right:0;position:absolute;z-index: 9999"
// document.body.appendChild(button)
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("message received")
  injectSelectors()
  sendResponse({ farewell: "goodbye" })
})

function injectSelectors() {
  if (!chrome.storage) return
  chrome.storage.sync.get(
    { members: [] },
    (items) => {
      const members = JSON.parse(items.members)
      const ids = ['member', 'ContentPlaceHolder1_applydiv', 'ContentPlaceHolder1_upLeader']
      ids.forEach((id) => {
        if ($('body').has(`#${id}`)) {
          const target = $('body').find(`div[id^='${id}']`)
          if (id == 'member' && !$('div#inject-selector-div').length) {
            target.find('div.panel-body').prepend(autoSelector(Object.values(members)))
            $("select[id^='inject-selector']").on('change', function (e) {
              console.log('member ' + e.target.value)
              autoFill(e, members, '.panel-body')
            })
          } else if (id == 'ContentPlaceHolder1_applydiv' && !$('div#inject-selector-applier-div').length) {
            target.prepend(autoSelector(Object.values(members), 'inject-selector-applier'))
            $("select[id^='inject-selector-applier']").on('change', function (e) {
              console.log('apply ' + e.target.value)
              autoFill(e, members, '.panel-body')
            })
          } else if (id == 'ContentPlaceHolder1_upLeader' && !$('div#inject-selector-leader-div').length) {
            $(autoSelector(Object.values(members), 'inject-selector-leader')).insertAfter("#ContentPlaceHolder1_upLeader .checkbox")
            $("select[id^='inject-selector-leader']").on('change', function (e) {
              console.log('leader ' + e.target.value)
              autoFill(e, members, '.panel-body')
            })
          }
        }
      }
      )
    }
  )
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
}

function autoSelector(options, id = 'inject-selector') {
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
    + options.map((option) => `<option value="${option['信箱']}">${option['姓名']}</option>`).join('\n') +
    `
      </select>
    </div>
  </div>
  `
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver
var observer = new MutationObserver(function (mutations, observer) {
  // console.log(mutations, observer)
  injectSelectors()
})

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.getElementById('accordion'), {
  subtree: true,
  attributes: true
})


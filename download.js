;(function () {
  var RELEASES = 'https://github.com/hee122086-del/weed-pass-releases/releases'
  var FALLBACK = RELEASES + '/latest'
  var links = document.querySelectorAll('.js-download')

  function apply(url, version) {
    links.forEach(function (link) {
      link.href = url
      link.setAttribute('download', '')
    })
    if (!version) return
    document.querySelectorAll('.js-version').forEach(function (el) {
      el.textContent = '버전 ' + version + ' · Windows 10·11'
    })
    document.querySelectorAll('.js-version-only').forEach(function (el) {
      el.textContent = version
    })
  }

  apply(FALLBACK, '')
  fetch('https://api.github.com/repos/hee122086-del/weed-pass-releases/releases/latest')
    .then(function (response) {
      return response.ok ? response.json() : Promise.reject(response.status)
    })
    .then(function (data) {
      var exe = (data.assets || []).find(function (asset) {
        return /\.exe$/i.test(asset.name)
      })
      apply(exe ? exe.browser_download_url : FALLBACK, (data.tag_name || '').replace(/^v/, ''))
    })
    .catch(function () {})

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var source = document.getElementById(button.getAttribute('data-copy'))
      var text = source.value !== undefined ? source.value : source.innerText
      var note = document.getElementById(source.id === 'shareLink' ? 'copiedLink' : 'copiedText')
      var done = function () {
        note.textContent = '복사했습니다. 붙여 넣기(Ctrl+V) 하세요.'
        setTimeout(function () {
          note.textContent = ''
        }, 2500)
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done)
      } else {
        var area = document.createElement('textarea')
        area.value = text
        document.body.appendChild(area)
        area.select()
        document.execCommand('copy')
        area.remove()
        done()
      }
    })
  })
})()

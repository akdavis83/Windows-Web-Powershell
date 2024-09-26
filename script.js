function historyNotRecognized(cmd) {
  return `
    <div>PS C:\\>&nbsp;${cmd}</div>
    <div>'<span class="txt-yellow">${cmd}</span>' is not recognized as an internal or external command,</div>
    <div>operable program or batch file.</div>
    <div>type <span class="txt-lightgreen">help</span> to show command list.</div>
  `;
}

function preTextHelp(txt, desc, tab = 1) {
  let _tab = "\t"
  switch(tab) {
    case 1 :
      _tab = "\t";
      break;
    case 2 :
      _tab = "\t\t";
      break;
    case 3 :
      _tab = "\t\t\t";
      break;
  }
  return `<span class="txt-lightgreen">${txt}</span>${_tab}: ${desc}`
}

function preText(txt, txtColor = 'white') {  
  return `<pre><span class="txt-${txtColor}">${txt}</span></pre>`
}


function history(cmd, result) {
  return `
    <div>PS C:\\>&nbsp;${cmd}</div>
    ${result}
  `;
}

$(document).ready(() => {
  let cmdList = [
    "help",
    "about",
    "clear",
    "ping"
  ];
  
  let textWelcome = `<div>Windows PowerShell</div>
    <div>Copyright (C) Microsoft Corporation. All rights reserved.</div>
    <br>
    <div>Windows Web PowerShell Command Prompt -V. Try the new cross-platform PowerShell https://aka.ms/pscore6</div>
    <br>`;
  $('.welcome').html(textWelcome);
  
  $('.shell-script').click(() => {
    $('.type').focus();
  });
  
  $('.type').on('keydown', (event) => {
    let which = event.which;
    let cmd = $('.type').text();
    
    if(which == 13) {
      if(cmd == "") {
        $('.history').append(`<div>PS C:\\>&nbsp;${cmd}</div>`);
        return false;
      }
      if(cmdList.includes(cmd) || cmdList.includes(cmd.split(" ")[0])) {
        
        if(cmd == "clear") {
           $('.history').html("");
        } else if(cmd == "about") {
          $('.history').append(history(cmd, `<div>${preText("About.", "lightgreen")}</div>`));
        } else if(cmd == "help") {
          $('.history').append(history(cmd, `<div><pre>
${preTextHelp("help", "Show command list.", 2)}
${preTextHelp("clear", "Clears the screen.", 2)}
${preTextHelp("ping [args]", "Ping (ping example.com).")}
${preTextHelp("about", "Show about.", 2)}
${preTextHelp("clear", "Clears the screen.", 2)}
</pre></div>`));
        } else if(cmd.split(" ")[0] == "ping") {
          let j = 0;
          $('.cmd-line').hide()
          $('.history').append(`<div>PS C:\\>&nbsp;${cmd}</div>`);
          $('.history').append(`<div>Pinging ${cmd.split(" ")[1]} [111.111.111.111] with 32 bytes of data:</div>`);
          let ping = setInterval(() => {
            j++;
            $('.history').append(`<div>Reply from 111.111.111.111: bytes=32 time=${Math.floor(Math.random() * 55)}ms TTL=53</div>`);
            $('.shell-script').scrollTop($('.shell-script')[0].scrollHeight);
            if(j == 5) {
              $('.cmd-line').show()
              $('.type').focus();
              $('.shell-script').scrollTop($('.shell-script')[0].scrollHeight);
              clearInterval(ping);
            }
          }, 2000);              
        }
      } else {
        $('.history').append(historyNotRecognized(cmd.replace("<", "")));
      }
      
      $('.type').text("");
      $('.shell-script').scrollTop($('.shell-script')[0].scrollHeight);
      return false;
    }
  })
})
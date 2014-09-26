setlocal wildignore+=dist
let g:used_javascript_libs = 'angularjs'
let g:syntastic_html_tidy_ignore_errors = [
  \ ' proprietary attribute "ng-',
  \ ' proprietary attribute "ui-',
  \ 'trimming empty <span>',
  \ 'trimming empty <i>',
  \ '<form> proprietary attribute "novalidate"',
  \ '<form> lacks "action" attribute',
  \ '<input> proprietary attribute "required"',
  \ '<select> proprietary attribute "required"',
  \ 'unescaped & which should be written as &amp;',
  \ '<nvd3-',
  \ 'discarding unexpected <nvd3-',
  \ 'discarding unexpected </nvd3-',
  \ '<button> proprietary attribute "csv-header"',
  \ '<button> proprietary attribute "filename"'
  \ ]

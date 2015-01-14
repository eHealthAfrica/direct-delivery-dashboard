setlocal wildignore+=dist,coverage
setlocal foldlevelstart=2
let $PATH = './node_modules/.bin:' . $PATH
let g:syntastic_javascript_checkers = ['eslint']
let g:used_javascript_libs = 'angularjs,angularui'
let g:syntastic_html_tidy_ignore_errors = [
  \ ' proprietary attribute "ng-',
  \ ' proprietary attribute "ui-',
  \ 'trimming empty <span>',
  \ 'trimming empty <i>',
  \ '<form> proprietary attribute "novalidate"',
  \ '<form> lacks "action" attribute',
  \ '<input> proprietary attribute "required"',
  \ '<input> proprietary attribute "details"',
  \ '<input> proprietary attribute "max"',
  \ '<input> proprietary attribute "min"',
  \ '<input> proprietary attribute "step"',
  \ '<select> proprietary attribute "required"',
  \ 'unescaped & which should be written as &amp;',
  \ '<div> proprietary attribute "growl"'
  \ ]

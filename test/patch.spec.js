/* global describe, it*/

var el = require('../lib/element')
var diff = require('../lib/diff')
var patch = require('../lib/patch')
var jsdom = require('mocha-jsdom')

var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
chai.should()

jsdom()

describe('Test patch fucntion', function () {
  it('Attributes adding', function () {
    var root = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('div', ['I love you']),
      el('section', ['I love you'])
    ])

    var root2 = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('div', {name: 'Jerry'}, ['I love you']),
      el('section', ['I love you'])
    ])

    var dom = root.render()
    var patches = diff(root, root2)

    var spy = dom.childNodes[1].setAttribute = sinon.spy()

    patch(dom, patches)

    spy.should.has.been.calledWith('name', 'Jerry').once
  })

  it('Attributes removing', function () {
    var root = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('div', ['I love you']),
      el('section', ['I love you'])
    ])

    var root2 = el('div', [
      el('p', ['I love you']),
      el('div', {name: 'Jerry'}, ['I love you']),
      el('section', ['I love you'])
    ])

    var dom = root.render()
    var patches = diff(root, root2)

    var spy = dom.removeAttribute = sinon.spy()
    patch(dom, patches)
    spy.should.has.been.calledOnce
  })

  it('Text replacing', function () {
    var root = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('div', ['I love you']),
      el('section', ['I love you'])
    ])

    var root2 = el('div', [
      el('p', ['I love you']),
      el('div', {name: 'Jerry'}, ['I love you']),
      el('section', ['I love you, too'])
    ])

    var dom = root.render()
    var patches = diff(root, root2)
    patch(dom, patches)

    dom.childNodes[2].textContent.should.be.equal('I love you, too')
  })

  it('Node replacing', function () {
    var root = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('div', ['I love you']),
      el('section', ['I love you'])
    ])

    var root2 = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('p', {name: 'Jerry'}, ['I love you']),
      el('section', ['I love you, too'])
    ])

    var dom = root.render()
    var patches = diff(root, root2)
    var spy = dom.replaceChild = sinon.spy()
    patch(dom, patches)

    spy.should.has.been.called.once
  })

  it('Nodes reordering', function () {
    var root = el('ul', {id: 'content'}, [
      el('li', {key: 'a'}, ['Item 1']),
      el('li', {key: 'b'}, ['Item 2']),
      el('li', {key: 'c'}, ['Item 3']),
      el('li', {key: 'd'}, ['Item 4']),
      el('li', {key: 'e'}, ['Item 5'])
    ])

    var root2 = el('ul', {id: 'content'}, [
      el('li', {key: 'a'}, ['Item 1']),
      el('li', {key: 'd'}, ['Item 4']),
      el('li', {key: 'b'}, ['Item 2']),
      el('li', {key: 'e'}, ['Item 5']),
      el('li', {key: 'c'}, ['Item 3'])
    ])

    var dom = root.render()
    var patches = diff(root, root2)
    var spy = dom.insertBefore = sinon.stub()
    var spy2 = dom.removeChild = sinon.stub()
    patch(dom, patches)

    spy.should.has.been.called.twice
    spy2.should.not.has.been.called
  })

  it('Root replacing', function () {
    var root = el('ul', {id: 'content'}, [
      el('li', {key: 'a'}, ['Item 1']),
      el('li', {key: 'b'}, ['Item 2']),
      el('li', {key: 'c'}, ['Item 3']),
      el('li', {key: 'd'}, ['Item 4']),
      el('li', {key: 'e'}, ['Item 5'])
    ])

    var root2 = el('div', {id: 'content'}, [
      el('li', {key: 'a'}, ['Item 1']),
      el('li', {key: 'd'}, ['Item 4']),
      el('li', {key: 'b'}, ['Item 2']),
      el('li', {key: 'e'}, ['Item 5']),
      el('li', {key: 'c'}, ['Item 3'])
    ])

    var dom = root.render()
    document.body.appendChild(dom)
    var patches = diff(root, root2)
    patch(dom, patches)
    dom = document.getElementById('content')
    dom.innerHTML.should.be.equal(root2.render().innerHTML)
  })
})

import Home from '@/components/Home'
import {stubSimpleTabStore} from '../helpers/storeHelper.js'
import {mountVuePageWithStore} from '../helpers/vueHelper.js'
import {shallow, mount, createLocalVue} from '@vue/test-utils'
import {registerHotWithContainer} from '../helpers/basicHotHelper.js'
import {HotRegister} from '@/hot.js'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'

describe('Home.vue', () => {
  // dummmy test to begin with to incorporate vue/html with existing framework
  describe('Home.vue toolbar menus', () => {
    let vm
    beforeEach(() => {
      vm = mountVuePageWithStore(Home, stubSimpleTabStore).$mount()
    })
    afterEach(() => {
      vm.$destroy()
    })
    let toolbarMenuTitles = ['Validate', 'Column', 'Table', 'Provenance', 'Package', 'Export']

    it('should render toolbar menu titles', () => {
      toolbarMenuTitles.forEach(function(expectedMenuName) {
        expect(vm.$el.querySelector('#toolbar').textContent).to.contain(expectedMenuName)
      })
    })

    it(`should have ${toolbarMenuTitles.length} menu titles`, () => {
      expect(vm.$el.querySelector('#toolbar li a div').length === toolbarMenuTitles.length)
    })
  })

  describe('Hot comments', () => {
    let wrapper
    let hot
    beforeEach(() => {
      const localVue = createLocalVue()
      localVue.use(Vuex)
      let store = new Vuex.Store(stubSimpleTabStore())
      wrapper = mount(Home, {store, localVue, attachToDocument: true})
      let container = wrapper.vm.$el.querySelector('#csvContent .editor')
      let hot = registerHotWithContainer(container)
    })
    afterEach(() => {
      HotRegister.destroyAllHots()
      wrapper.vm.$destroy()
      wrapper = null
      hot = null
    })
    it('should trigger Comments when messages type equals error', sinonTest(async function() {
      expect(wrapper.vm.currentColumnIndex).to.equal(0)
      expect(wrapper.vm.messages).to.equal(false)
      this.stub(HotRegister, 'getActiveInstance').returns(hot)
      let messages = stubBasicErrorMessage1()
      wrapper.setData({messagesTitle: 'Validation Errors', messagesType: 'error', messages: messages})
      await flushPromises()
      const el = wrapper.findAll(`#csvContent .editor .ht_master table.htCore tr:nth-of-type(1) td:nth-of-type(1).htCommentCell`)
      expect(el.length).to.equal(1)
    }))
    it('should NOT trigger Comments when messages type does NOT equal error', sinonTest(async function() {
      expect(wrapper.vm.currentColumnIndex).to.equal(0)
      expect(wrapper.vm.messages).to.equal(false)
      this.stub(HotRegister, 'getActiveInstance').returns(hot)
      let messages = stubBasicErrorMessage1()
      wrapper.setData({messagesTitle: 'Validation Errors', messagesType: 'foo', messages: messages})
      await flushPromises()
      const el = wrapper.findAll(`#csvContent .editor .ht_master table.htCore tr:nth-of-type(1) td:nth-of-type(1).htCommentCell`)
      expect(el.length).to.equal(0)
    }))
  })
})

function stubBasicErrorMessage1() {
  return [
    {
      rowNumber: 1,
      columnNumber: 1,
      message: 'Test error'
    }
  ]
}
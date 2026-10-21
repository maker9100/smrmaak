"""WebKit engine touch routing checks; these do not emulate physical iPad OS UI."""
import os
import pytest
from test_browser import server_url, center, shots, start_split_ai

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_WEBKIT_TESTS')!='1',reason='Opt-in WebKit checks')

@pytest.fixture
def safari(server_url):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser=pw.webkit.launch(headless=True)
        context=browser.new_context(viewport={'width':1180,'height':820},has_touch=True,is_mobile=True)
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(server_url);start_split_ai(page)
        page.wait_for_function('state?.state==="COUNTDOWN"')
        print('WebKit renderer:',page.evaluate('renderer3d ? "WebGL2" : "Canvas fallback"'))
        yield page
        context.close();browser.close()
        assert not errors,errors


def finger(page,kind,identifier,x,y):
    return page.evaluate('''({kind,id,x,y})=>{
        window.testTouches ||= new Map();
        const prev=testTouches.get(id),target=prev?.target||document.elementFromPoint(x,y);
        const touch={identifier:id,target,clientX:x,clientY:y,pageX:x,pageY:y,screenX:x,screenY:y,radiusX:3,radiusY:3,force:1};
        if(kind==='touchend'||kind==='touchcancel')testTouches.delete(id);else testTouches.set(id,touch);
        const touches=Array.from(testTouches.values());
        const e=new Event(kind,{bubbles:true,cancelable:true});
        Object.defineProperties(e,{touches:{value:touches},targetTouches:{value:touches.filter(t=>t.target===target)},changedTouches:{value:[touch]}});
        target.dispatchEvent(e);return e.defaultPrevented;
    }''',{'kind':kind,'id':identifier,'x':x,'y':y})


def test_webkit_held_sticks_and_long_press(safari):
    page=safari;a,b=center(page,'[data-stick="0"]'),center(page,'[data-stick="1"]')
    assert finger(page,'touchstart',1,*a)
    assert finger(page,'touchstart',2,*b)
    finger(page,'touchmove',1,a[0],a[1]-35);finger(page,'touchmove',2,b[0]+35,b[1])
    page.wait_for_function('state.state==="PLAYING"');page.wait_for_timeout(900)
    assert page.evaluate('state.players.find(p=>p.id===ids[0]).x')>4
    assert page.evaluate('state.players.find(p=>p.id===ids[1]).y')>7
    assert page.evaluate('getSelection().toString()')==''
    assert page.locator('[data-stick="0"]').evaluate("el=>getComputedStyle(el).userSelect")=='none'
    if page.evaluate("CSS.supports('-webkit-touch-callout','none')"):
        assert page.locator('[data-stick="0"]').evaluate("el=>getComputedStyle(el).webkitTouchCallout")=='none'
    assert not page.locator('[data-stick="0"]').evaluate('el=>el.dispatchEvent(new Event("contextmenu",{bubbles:true,cancelable:true}))')
    finger(page,'touchcancel',1,a[0],a[1]-35);finger(page,'touchend',2,b[0]+35,b[1])
    assert page.evaluate('[0,1].every(i=>control(i).stick===null&&control(i).f===0&&control(i).s===0)')


def test_webkit_tap_drag_final_position_and_pause(safari):
    page=safari;page.wait_for_function('state.state==="PLAYING"');before=shots(page)
    # A coalesced swipe has only touchstart and touchend, with a different end position.
    finger(page,'touchstart',3,280,280);finger(page,'touchend',3,430,230);page.wait_for_timeout(150)
    assert shots(page)==before
    assert page.evaluate('motion.get(ids[0]).pitch')>.1
    page.touchscreen.tap(280,280);page.wait_for_timeout(200)
    assert shots(page)[0]==before[0]+1 and shots(page)[1]==before[1]
    fire=center(page,'[data-action="fire"][data-slot="1"]')
    finger(page,'touchstart',5,*fire);page.wait_for_timeout(350);finger(page,'touchend',5,*fire);page.wait_for_timeout(100)
    assert shots(page)[1]>=before[1]+2
    page.locator('#pause').tap();assert page.locator('#settings').is_visible()
    assert page.evaluate('contacts.size===0');page.locator('#settingsClose').tap()
    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150)
    assert page.evaluate('viewportLayout()[1].y>0&&viewportLayout()[1].w===viewportWidth')

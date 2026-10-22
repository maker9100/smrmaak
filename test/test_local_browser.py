import os
import pytest
from test_browser import browser,server_url

pytestmark=pytest.mark.skipif(os.getenv('CHEAT_FPS_BROWSER_TESTS')!='1',reason='Opt-in browser checks')


def open_local(page,url,split=False,code=''):
    page.goto(url);page.locator('#mode').select_option('local');page.locator('#create').click()
    if split:page.locator('#split').check()
    if code:page.locator('#code').fill(code);page.locator('#join').click()
    else:page.locator('#hostLocal').click()
    page.wait_for_function('state?.state==="LOBBY"')


def test_one_device_split_waits_for_both_ready_then_starts_two_players(browser,server_url):
    context=browser.new_context(viewport={'width':1180,'height':760},has_touch=True,is_mobile=True)
    errors=[]
    try:
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        open_local(page,server_url,split=True)
        assert page.locator('[data-ready]').count()==2 and page.locator('#start').is_disabled()
        a,b=page.evaluate('ids')
        page.locator(f'[data-ready="{a}"]').tap()
        page.wait_for_function('state.players.find(p=>p.id===ids[0]).ready')
        assert page.evaluate('state.state==="LOBBY"&&!state.players.find(p=>p.id===ids[1]).ready')
        assert page.locator('#start').is_disabled()
        page.locator(f'[data-ready="{b}"]').tap()
        page.wait_for_function('state?.state==="COUNTDOWN"')
        assert page.evaluate('state.players.length===2&&state.players.every(p=>!p.bot)&&[0,1].every(t=>state.players.filter(p=>p.team===t).length===1)')
        page.wait_for_function('state?.state==="PLAYING"')
        assert page.locator('.joystick').count()==2 and page.locator('#playUI').is_visible()
        assert not errors,errors
    finally:context.close()


def test_two_devices_cannot_start_on_one_team_then_auto_start_one_vs_one(browser,server_url):
    context=browser.new_context(viewport={'width':1180,'height':760})
    errors=[]
    try:
        a=context.new_page();b=context.new_page()
        for page in [a,b]:page.on('pageerror',lambda e:errors.append(str(e)))
        open_local(a,server_url);open_local(b,server_url,code=a.evaluate('state.code'))
        a.wait_for_function('state.players.length===2')
        a.locator('[data-ready]').click();b.locator('[data-ready]').click()
        a.wait_for_function('state.players.every(p=>p.ready)')
        assert a.evaluate('state.state==="LOBBY"&&!state.can_start')
        assert a.locator('#start').is_disabled() and '각각 1명' in a.locator('#controlsInfo').inner_text()
        b.locator('[data-team]').select_option('1')
        b.wait_for_function('state.players.find(p=>p.id===ids[0]).team===1&&!state.players.find(p=>p.id===ids[0]).ready')
        assert b.evaluate('state.state==="LOBBY"')
        b.locator('[data-ready]').click()
        for page in [a,b]:
            page.wait_for_function('state?.state==="COUNTDOWN"')
            assert page.evaluate('ids.length===1&&state.players.length===2&&state.players.every(p=>!p.bot)')
        assert not errors,errors
    finally:context.close()

import json
import os
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


BASE = os.environ.get("AUDIT_BASE_URL", "http://localhost:3000").rstrip("/")
ADMIN_BASE = os.environ.get("AUDIT_ADMIN_URL", "http://localhost:3001").rstrip("/")
results = []


def record(item, passed, detail):
    results.append({"item": item, "passed": bool(passed), "detail": detail})


def visible(xpath):
    return next(element for element in driver.find_elements(By.XPATH, xpath) if element.is_displayed())


options = Options()
options.binary_location = "/usr/bin/google-chrome"
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--lang=pt-BR")
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

driver = webdriver.Chrome(options=options)
driver.set_page_load_timeout(30)

try:
    pages = [
        ("home", "/"), ("institucional", "/institucional"),
        ("noticias", "/noticias"), ("noticia_175", "/noticias/175"),
        ("programas", "/programas"), ("programa_58", "/programas/58"),
        ("publicacoes", "/publicacoes"), ("contato", "/contato"),
        ("doacoes", "/doacoes"), ("trabalhe", "/trabalhe-conosco"),
    ]
    page_data = {}
    for name, path in pages:
        driver.set_window_size(1440, 1000)
        driver.get(BASE + path)
        time.sleep(1)
        body = driver.find_element(By.TAG_NAME, "body").text
        images = driver.find_elements(By.TAG_NAME, "img")
        broken = [img.get_attribute("src") for img in images if driver.execute_script(
            "return arguments[0].complete && arguments[0].naturalWidth === 0", img
        )]
        headings = [(h.tag_name, h.text.strip()) for h in driver.find_elements(By.CSS_SELECTOR, "h1,h2,h3,h4,h5,h6")]
        severe_logs = [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]
        page_data[name] = {
            "url": driver.current_url,
            "title": driver.title,
            "body": body,
            "broken": broken,
            "headings": headings,
            "severe_logs": severe_logs,
            "links": [(a.text.strip(), a.get_attribute("href")) for a in driver.find_elements(By.TAG_NAME, "a")],
            "missing_alt": len(driver.find_elements(By.CSS_SELECTOR, "img:not([alt])")),
        }
        record(f"page:{name}", driver.current_url.startswith(BASE + path) and len(body) > 50,
               f"title={driver.title!r}; h1={sum(1 for tag, _ in headings if tag == 'h1')}; broken={len(broken)}; console={len(severe_logs)}")

    home = page_data["home"]
    driver.get(BASE + "/")
    time.sleep(.5)
    logo = driver.find_element(By.CSS_SELECTOR, "img[alt*='Logo Centro']")
    logo.click()
    record("1.1", driver.current_url == BASE + "/", f"clique terminou em {driver.current_url}")
    donate = driver.find_element(By.XPATH, "//button[contains(., 'Doe agora')]")
    donate.click()
    time.sleep(.4)
    record("1.2", driver.current_url.endswith("/doacoes"), f"clique terminou em {driver.current_url}")
    driver.get(BASE + "/")
    search_buttons = driver.find_elements(By.XPATH, "//button[.//img[contains(@alt, 'pesquisa')]]")
    if search_buttons:
        search_buttons[0].click()
        time.sleep(.3)
    record("1.4", bool(driver.find_elements(By.CSS_SELECTOR, "input")), "campo de pesquisa aberto após clique")
    fixed_header = driver.execute_script("return [...document.querySelectorAll('*')].some(e => getComputedStyle(e).position === 'fixed' && e.querySelector(\"img[alt*='Logo Centro']\"))")
    record("1.9", fixed_header, "contêiner fixo contém o logo")
    record("1.5", all(label in home["body"] for label in ["Institucional", "Programas", "Notícias", "Publicações", "Contato"]), "Itens principais presentes")
    record("2.1", "Defendendo a dignidade humana" in page_data["institucional"]["body"], "Texto localizado na capa institucional")
    record("3.1", "Nossa Missão" in home["body"], "Bloco Nossa Missão presente")
    record("3.2", "Nossa Visão" in home["body"], "Bloco Nossa Visão presente")

    driver.set_window_size(375, 900)
    driver.get(BASE + "/")
    visible("//button[contains(., 'Menu')]").click()
    time.sleep(.3)
    mobile_open = bool(driver.find_elements(By.XPATH, "//button[contains(., 'Contato')]"))
    visible("//button[contains(., 'Contato')]").click()
    time.sleep(.5)
    mobile_closed = not driver.find_elements(By.XPATH, "//button[contains(., 'Linha do tempo')]")
    record("1.6", mobile_open, "gaveta mobile abriu")
    record("1.7", driver.current_url.endswith("/contato") and mobile_closed, "link principal navegou e fechou gaveta")
    driver.get(BASE + "/")
    visible("//button[contains(., 'Menu')]").click()
    visible("//button[contains(., 'Notícias')]").click()
    time.sleep(.5)
    record("1.8", driver.current_url.endswith("/noticias") and not driver.find_elements(By.XPATH, "//button[contains(., 'Linha do tempo')]") , "subitem navegou e fechou gaveta")

    driver.get(BASE + "/institucional")
    time.sleep(1)
    for item, anchor in [("4.2", "timeline"), ("4.3", "organizacao"), ("4.4", "liderancas"), ("4.5", "transparencia"), ("4.6", "faq")]:
        elements = driver.find_elements(By.ID, anchor)
        record(item, bool(elements), f"id=#{anchor} {'presente' if elements else 'ausente'}")

    for width in [375, 430, 768, 834, 1280, 1440, 1920]:
        driver.set_window_size(width, 1000)
        driver.get(BASE + "/")
        time.sleep(.5)
        overflow = driver.execute_script("return document.documentElement.scrollWidth - document.documentElement.clientWidth")
        record(f"viewport:{width}", overflow <= 1, f"overflow horizontal={overflow}px")

    driver.get(ADMIN_BASE + "/admin/login")
    driver.find_element(By.NAME, "email").send_keys(os.environ["ADMIN_EMAIL"])
    driver.find_element(By.NAME, "password").send_keys(os.environ["ADMIN_PASSWORD"])
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(4)
    driver.get_log("browser")
    admin_body = driver.find_element(By.TAG_NAME, "body").text
    admin_links = [(a.text.strip(), a.get_attribute("href")) for a in driver.find_elements(By.TAG_NAME, "a")]
    admin_logs = [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]
    resource_links = sorted(set(href for _, href in admin_links if href and "/admin/resources/" in href))
    admin_buttons = [button.text.strip() for button in driver.find_elements(By.TAG_NAME, "button") if button.text.strip()]
    record("9.1", "/admin/login" not in driver.current_url, f"Login terminou em {driver.current_url}")
    record("9.2", len(resource_links) >= 20, f"links de recursos encontrados={len(resource_links)}")
    record("9.8", not admin_logs, f"erros severos no console={len(admin_logs)}")
    record("admin_text", bool(admin_body.strip()), f"corpo autenticado com {len(admin_body)} caracteres")

    for item, resource, expected in [("9.3", "Noticia", "Audiência Pública"),
                                     ("9.4", "Programa", "ATITUDE"),
                                     ("9.5", "Transparencia", "Estatuto Social")]:
        driver.get(f"{ADMIN_BASE}/admin/resources/{resource}")
        time.sleep(2)
        text = driver.find_element(By.TAG_NAME, "body").text
        record(item, expected in text, f"recurso {resource}; texto esperado {'presente' if expected in text else 'ausente'}")

    driver.get(ADMIN_BASE + "/admin/resources/Noticia/records/175/edit")
    time.sleep(3)
    editor_count = len(driver.find_elements(By.CSS_SELECTOR, "[contenteditable='true'], iframe, .sun-editor"))
    upload_count = len(driver.find_elements(By.CSS_SELECTOR, "input[type='file']"))
    edit_logs = [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]
    record("9.6", editor_count > 0, f"editores ricos encontrados={editor_count}")
    record("9.7", upload_count > 0, f"campos de upload encontrados={upload_count}; envio não persistido")
    record("9.8", not edit_logs, f"erros severos na página de edição={len(edit_logs)}")

    page_summary = {
        name: {
            "url": data["url"], "title": data["title"], "broken": data["broken"],
            "headings": [(tag, text) for tag, text in data["headings"] if text], "missing_alt": data["missing_alt"],
            "severe_logs": [entry["message"] for entry in data["severe_logs"]],
        }
        for name, data in page_data.items()
    }
    print(json.dumps({"results": results, "pages": page_summary, "admin_resources": resource_links,
                      "admin_buttons": admin_buttons, "admin_body": admin_body,
                      "admin_logs": admin_logs}, ensure_ascii=False, indent=2))
finally:
    driver.quit()

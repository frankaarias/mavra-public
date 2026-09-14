# -*- coding: utf-8 -*-
"""Compone brand.json de MAVRA: las listas salen de _extract.json (sacadas del JSX
sin re-tipear) y la prosa suelta se declara acá, que es lo único que había que
mover a mano."""
import io, json, collections

E = json.load(io.open("brand/_extract.json", encoding="utf-8"))
O = collections.OrderedDict

brand = O()

brand["identity"] = O([
    ("name", "MAVRA"),
    ("tagline", "Inhabit your shadow."),
    ("slogan", "The darkness you deserved."),
    ("movement", "Dark Renaissance"),
    ("archetype", O([
        ("name", "The Liberator"),
        ("quote", "Aquí puedes ser quien realmente eres."),
        ("body", "No opera desde la escasez. Opera desde la habilitación — construye el espacio donde el cliente puede ser completamente él mismo, sin necesidad de aprobación externa."),
    ])),
    ("symbol", O([
        ("name", "La calavera"),
        ("body", "Memento mori elevado a objeto de diseño. No evoca muerte como amenaza sino como recordatorio de vivir con intención. El cráneo MAVRA es anatómicamente preciso, esculpido, no estampado — diferenciación táctil y visual inmediata."),
    ])),
    ("market", "USA"),
    ("language", "en-US"),
    ("docVersion", "Ver. 2026 · Documento interno"),
    ("voice", O([
        ("always", E["voiceSiempre"]),
        ("never", E["voiceNunca"]),
    ])),
])

brand["positioning"] = O([
    ("coreValue", "La oscuridad no es ausencia de luz. Es la presencia de profundidad."),
    ("statement", "Para los curadores de espacios oscuros que buscan profundidad estética más allá de lo temporal, MAVRA es la única marca de home decor gótico que combina maestría artesanal con narrativa simbólica — porque creemos que la oscuridad es una forma superior y legítima de hacer hogar."),
    ("territory", "MAVRA ocupa el espacio vacío entre alta sofisticación estética y accesibilidad e-commerce. Los competidores directos eligen uno de los dos extremos. MAVRA es la única marca que combina narrativa de lujo oscuro con distribución Amazon Prime."),
    ("whyWe", "Somos MAVRA, curadores de espacios oscuros con maestría — creemos en que la sombra es una forma superior y legítima de hacer hogar."),
    ("fiveWhats", E["cincoQues"]),
    ("purpose", E["propositoPees"]),
    ("commandments", E["mandamientos"]),
    ("values", E["brandValues"]),
    ("narratives", E["narratives"]),
    ("pyramid", E["pyramidLevels"]),
    ("antiCompetition", E["revolutions"]),
    ("conclusions", O([
        ("platform", "MAVRA no vende productos de decoración. Vende el derecho a habitar la propia sombra sin disculpa. El posicionamiento es defensible porque requiere consistencia total — una inconsistencia en el tono destruye la ilusión de permanencia."),
        ("total", [
            "MAVRA no compite en el mercado del home decor gótico. MAVRA define el estándar de lo que ese mercado debería ser.",
            "La ventaja competitiva es la coherencia total del sistema: cada touchpoint — desde el listing de Amazon hasta el papel de seda del unboxing — refuerza la misma promesa: la oscuridad como forma de maestría.",
            "Tagline final: \"Inhabit your shadow.\" — instrucción, no descripción. MAVRA no dice lo que es. Le dice al cliente lo que puede ser.",
        ]),
    ])),
])

brand["audience"] = O([
    ("matrix", O([
        ("buyer", O([("label", "The Guy — Quien compra"), ("body", "Usuario de Amazon Prime con alta alfabetización visual. Ya cruzó el umbral de aceptación social de lo \"macabro\". Su motivación central es la curaduría del entorno — necesita que cada objeto en su hogar refleje coherencia intelectual y sofisticación.")])),
        ("user", O([("label", "The Dog — Quien disfruta"), ("body", "El consumidor actúa como validador de la experiencia. Su estatus no se eleva por el precio del objeto, sino por su capacidad de transformar una habitación genérica en un espacio cargado de narrativa.")])),
        ("aspiration", O([("label", "The Queen — A quien aspiramos"), ("body", "El Elder Goth, 25–45 años. Profesional creativo con ingreso estable. Ha superado las fases experimentales y busca piezas duraderas que se integren en un hogar de diseño Dark Academia o minimalismo oscuro.")])),
        ("lost", O([("label", "The Snake — Quien se fue con la competencia"), ("body", "El consumidor que se fue a Target o Spirit Halloween por: percepción de kitsch, falta de narrativa (sin valor simbólico no justifica el precio), fricción logística.")])),
    ])),
    ("feelMap", O([
        ("headers", ["Feel Out — Yo Exterior", "Feel In — Yo Interior"]),
        ("rows", E["feelMapRows"]),
    ])),
    ("desireCanvas", [
        O([("label", "Self — Autoimagen"), ("body", "Soy una persona con sensibilidad estética superior. Mi elección de objetos demuestra que no soy un consumidor pasivo de tendencias, sino un curador de mi propia existencia.")]),
        O([("label", "Enemy — Dominio"), ("body", "Esa persona ha logrado capturar una atmósfera que a mí me falta. Existe una envidia estética — la lámpara de proyección actúa como eje central que cohesiona el estilo.")]),
        O([("label", "Friend — Aspiraciones"), ("body", "Mi amigo entiende mi mundo. Su compra valida mi propio gusto y refuerza nuestra conexión subcultural.")]),
        O([("label", "Social — Estatus"), ("body", "Quiero que perciban mi hogar como un lugar de misterio, elegancia y sabiduría. Un espacio donde cada detalle ha sido elegido para contar una historia.")]),
    ]),
    ("journey", O([
        ("headers", ["Proof Points — Qué necesita para confiar", "Feel Points — Cómo lo hacemos sentir único", "Sweet Points — Cómo tangibilizamos"]),
        ("rows", E["journeyRows"]),
    ])),
    ("ego", "MAVRA se posiciona en el cuadrante Provocador / Dominante — una marca que desafía las normas estéticas convencionales con confianza absoluta. No busca aprobación masiva. Se dirige a quienes ya han tomado la decisión de vivir de forma auténtica."),
    ("conclusions", [
        "El consumidor MAVRA es un alquimista del ambiente. Su acto de compra no es consumismo — es curaduría. El producto debe hablar en el idioma de la permanencia y la profundidad.",
        "Insight central: \"No compro decoración. Construyo un santuario.\"",
    ]),
])

brand["competitors"] = O([
    ("headers", ["Competidor", "Territorio", "Debilidad que MAVRA explota"]),
    ("rows", E["competitorRows"]),
])

brand["visual"] = O([
    ("palette", O([("board", E["colorBoard"])])),
    ("senses", E["sensoryCards"]),
])

brand["activation"] = O([
    ("goldenMoments", E["goldenMoments"]),
    ("burnPyramid", E["burnLevels"]),
])

brand["nav"] = O([("brandGuidelines", E["navLinks"])])

io.open("brand/brand.json", "w", encoding="utf-8").write(
    json.dumps(brand, ensure_ascii=False, indent=1))
print("brand.json escrito |", sum(len(json.dumps(v)) for v in brand.values()), "chars")
for k, v in brand.items():
    print("  %-12s %s" % (k, list(v.keys())))

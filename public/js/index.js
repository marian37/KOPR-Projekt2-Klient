var URL = "http://localhost:8080/recepty/";

var stareHtml = new Map();

$(document).ready(function() {
	var pocetIngrediencii = 1;

	dajVsetky();

	// zobraz vsetky
	$(".btnZobrazVsetky").on("click", function() {
		dajVsetky();
	});

	// dalsia ingrediencia
	$(".pravy").on("click", ".btnDalsiaIngrediencia", function() {
		$(this).before("<br />Ingrediencia: <input type=\"text\" name=\"ingrediencia\" class=\"ingrediencie\"> Množstvo: <input type=\"text\" name=\"mnozstvo\" class=\"ingrediencie\"> ");
		pocetIngrediencii++;
	});

	// pridaj recept
	$(".pravy").on("click", ".btnPridaj", function() {
		var nazov = uprav(document.getElementsByName('nazov')[0].value);
		var autor = uprav(document.getElementsByName('autor')[0].value);
		var postupPripravy = uprav(document.getElementsByName('postup')[0].value);
		var ingrediencie = new Object(); 

		for (var i = 0; i < pocetIngrediencii; i++) {
			var ingrediencia = uprav(document.getElementsByName('ingrediencia')[i].value);
			var mnozstvo = uprav(document.getElementsByName('mnozstvo')[i].value);
			if (ingrediencia && mnozstvo) {
				ingrediencie[ingrediencia] = mnozstvo;
			}
		}

		var recept = {
			"nazovReceptu": nazov,
			"menoAutora": autor,
			"ingrediencie": ingrediencie,
			"postupPripravy": postupPripravy
		};

		if (nazov && autor && postupPripravy && ingrediencie) {
			$.ajax({
				url: URL,
				method: "POST",
				headers: { 
					"Accept" : "application/json",
					"Content-Type": "application/json" 
				},
				data: JSON.stringify(recept),
				dataType: "json",				
			}).then(function(uuid) {
				dajVsetky();
				pocetIngrediencii = 1;
				vynulujPoliaPreNovyRecept();
				alert("Úspešne pridaný recept s UUID " + uuid);
			});

		} else {
			alert("Chýba nejaký údaj.");
		}
	});

	// vymaz recept
	$(".lavy").on("click", ".btnVymaz", function() {
		var uuid = $(this).attr("id");
		$.ajax({
			url: URL + uuid,
			method: "DELETE"			
		}).then(function() {
			dajVsetky();
		});
	});

	// uprav recept
	$(".lavy").on("click", ".btnUprav", function() {
		var uuid = $(this).attr("id");
		var parent = $(this).parent();
		stareHtml.set(uuid, parent.html());
		$.ajax({
			url: URL + uuid,
		}).then(function(recept) {
			var html = "<b>UUID: </b>" + recept.uuid + "<br />";
			html += "<b>Názov: </b><input type=\"text\" name=\"nazov-" + recept.uuid + "\" value=\"" + recept.nazovReceptu + "\"><br />";
			html += "<b>Autor: </b><input type=\"text\" name=\"autor-" + recept.uuid + "\" value=\"" + recept.menoAutora + "\"><br />";
			html += "<b>Ingrediencie:</b><br />";
			$.each (recept.ingrediencie, function(ingrediencia, mnozstvo) {
				html += "Ingrediencia: <input type=\"text\" name=\"ingrediencia-" + recept.uuid + "\" value=\"" + ingrediencia + "\"> ";
				html += "Množstvo: <input type=\"text\" name=\"mnozstvo-" + recept.uuid + "\" value=\"" + mnozstvo + "\"><br />";
			});
			html += "<button class=\"btnIngrediencia\" id=\"" + recept.uuid + "\">Ďalšia ingrediencia</button>";
			html += "<br />";
			html += "<b>Postup prípravy:</b> <textarea cols=\"66\" rows=\"5\" name=\"postup-" + recept.uuid + "\">" + recept.postupPripravy + "</textarea><br />";
			html += "<button class=\"btnZrus\" id=\"" + recept.uuid + "\">Zruš</button>";
			html += "<button class=\"btnUloz\" id=\"" + recept.uuid + "\">Ulož</button>";
			
			parent.html(html);
		});
	});

	// zrus upravu receptu
	$(".lavy").on("click", ".btnZrus", function() {
		var uuid = $(this).attr("id");
		$(this).parent().html(stareHtml.get(uuid));
	});

	// uloz upravu receptu
	$(".lavy").on("click", ".btnUloz", function() {
		var uuid = $(this).attr("id");
		var nazov = uprav(document.getElementsByName('nazov-' + uuid)[0].value);
		var autor = uprav(document.getElementsByName('autor-' + uuid)[0].value);
		var postupPripravy = uprav(document.getElementsByName('postup-' + uuid)[0].value);
		var ingrediencie = new Object(); 

		var parent = $(this).parent();
		var ingrediencieElements = document.getElementsByName('ingrediencia-' + uuid);

		for (var i = 0; i < ingrediencieElements.length; i++) {
			var ingrediencia = uprav(ingrediencieElements[i].value);
			var mnozstvo = uprav(document.getElementsByName('mnozstvo-' + uuid)[i].value);
			if (ingrediencia && mnozstvo) {
				ingrediencie[ingrediencia] = mnozstvo;
			}
		}

		var recept = {
			"nazovReceptu": nazov,
			"menoAutora": autor,
			"ingrediencie": ingrediencie,
			"postupPripravy": postupPripravy
		};

		if (nazov && autor && postupPripravy && ingrediencie) {
			$.ajax({
				url: URL + uuid,
				method: "POST",
				headers: { 
					"Accept" : "application/json",
					"Content-Type": "application/json" 
				},
				data: JSON.stringify(recept),
				dataType: "json",				
			}).then(function(recept) {
				var html = "<b>UUID:</b> " + recept.uuid + "<br />";
				html += "<b>Názov:</b> " + recept.nazovReceptu + "<br />";
				html += "<b>Autor:</b> " + recept.menoAutora + "<br />";
				html += "<b>Ingrediencie:</b> ";
				$.each (recept.ingrediencie, function(ingrediencia, mnozstvo) {
					html += mnozstvo + " " + ingrediencia + ", ";
				});
				html += "<br />";
				html += "<b>Postup prípravy:</b> " + recept.postupPripravy + "<br />";
				html += "<button class=\"btnVymaz\" id=\"" + recept.uuid + "\">Vymaž</button>";
				html += "<button class=\"btnUprav\" id=\"" + recept.uuid + "\">Uprav</button>";
				parent.html(html);
				alert("Úspešne upravený recept s UUID " + recept.uuid);
			});

		} else {
			alert("Chýba nejaký údaj.");
		}	
	});

	// dalsia ingrediencia uprava receptu
	$(".lavy").on("click", ".btnIngrediencia", function() {
		var uuid = $(this).attr("id");
		$(this).before("Ingrediencia: <input type=\"text\" name=\"ingrediencia-" + uuid + "\"> Množstvo: <input type=\"text\" name=\"mnozstvo-" + uuid + "\"><br />");
	});

	// hladaj podla UUID
	$(".btnUuid").on("click", function() {
		var uuid = uprav(document.getElementsByName('hladaj-uuid')[0].value);
		if (uuid != "") {
			$.ajax({
				url: URL + uuid,
				error: function(request, status, error) {
					zobrazRecepty([], "ziadne");
					document.getElementsByName('hladaj-uuid')[0].value = "";
				}
			}).then(function(recept) {
				var recepty = [recept];
				zobrazRecepty(recepty, "uuid");
				document.getElementsByName('hladaj-uuid')[0].value = "";
			});
		}
	});

	// hladaj podla klucovych slov
	$(".btnKlucoveSlova").on("click", function() {
		var hladaj = uprav(document.getElementsByName('hladaj-klucove-slova')[0].value);
		var klucoveSlova = hladaj.split(" ");
		$.ajax({
			url: URL + "hladaj/klucove-slova/",
			method: "POST",
			headers: { 
				"Accept" : "application/json",
				"Content-Type": "application/json" 
			},
			data: JSON.stringify(klucoveSlova),
			dataType: "json",
		}).then(function(recepty) {
			zobrazRecepty(recepty, "najdene");
			document.getElementsByName('hladaj-klucove-slova')[0].value = "";
		});
	});

	// hladaj podla ingrediencii
	$(".btnIngrediencie").on("click", function() {
		var hladaj = uprav(document.getElementsByName('hladaj-ingrediencie')[0].value);
		var ingrediencie = hladaj.split(" ");
		$.ajax({
			url: URL + "hladaj/ingrediencie/",
			method: "POST",
			headers: { 
				"Accept" : "application/json",
				"Content-Type": "application/json" 
			},
			data: JSON.stringify(ingrediencie),
			dataType: "json",

		}).then(function(recepty) {
			zobrazRecepty(recepty, "najdene");
			document.getElementsByName('hladaj-ingrediencie')[0].value = "";
		});
	});
});

function dajVsetky() {
	$.ajax({
		url: URL
	}).then(function(recepty) {
		zobrazRecepty(recepty, "vsetky");
	});
}

function zobrazRecepty(recepty, typ) {
	var html = "";
	if (recepty.length == 0) {
		typ = "ziadne";
	}
	switch (typ) {
		case "vsetky":
			html += "<b>Všetky recepty [" + recepty.length + "]:</b>";
			break;
		case "najdene":
			html += "<b>Nájdené recepty [" + recepty.length + "]:</b>";
			break;
		case "ziadne":
			html += "<b>Nenašli sa žiadne recepty.</b>";
			break;
		case "uuid":
			html += "<b>Recept so zadaným uuid:</b>";
			break;
	}

	for (var i = 0; i < recepty.length; i++) {
		html += "<div class=\"recept\">";
		html += "<b>UUID:</b> " + recepty[i].uuid + "<br />";
		html += "<b>Názov:</b> " + recepty[i].nazovReceptu + "<br />";
		html += "<b>Autor:</b> " + recepty[i].menoAutora + "<br />";
		html += "<b>Ingrediencie:</b> ";
		$.each (recepty[i].ingrediencie, function(ingrediencia, mnozstvo) {
			html += mnozstvo + " " + ingrediencia + ", ";
		});
		html += "<br />";
		html += "<b>Postup prípravy:</b> " + recepty[i].postupPripravy + "<br />";
		html += "<button class=\"btnVymaz\" id=\"" + recepty[i].uuid + "\">Vymaž</button>";
		html += "<button class=\"btnUprav\" id=\"" + recepty[i].uuid + "\">Uprav</button>";
		html += "</div>";
	}

	$(".lavy").html(html);
}

function vynulujPoliaPreNovyRecept() {
	$(".pridaj").html("<h3>Pridaj nový recept</h3> Názov: <input type=\"text\" name=\"nazov\"><br /> Autor: <input type=\"text\" name=\"autor\"><br /> Ingrediencie: <br /> Ingrediencia: <input type=\"text\" name=\"ingrediencia\" class=\"ingrediencie\"> Množstvo: <input type=\"text\" name=\"mnozstvo\" class=\"ingrediencie\"> <button class=\"btnDalsiaIngrediencia\">Ďalšia ingrediencia</button><br /> Postup prípravy: <br /> <textarea cols=\"80\" rows=\"5\" name=\"postup\"></textarea><br /> <button class=\"btnPridaj\">Pridaj recept</button>");
}

function uprav(string) {
	string = string.trim();
	return string.replace("\"", "\\\"");
}

// Commands({
//     "annotate": function () {
//         referencias = Refs.find({$or: [{annotate: { $exists: false}}, {annotate: false}]}, { fields: { _id: 1 } }).fetch();
//         dicts = Dicts.find({dictgroup: "tipi"}).fetch();
//         total = referencias.length;
//         _.each(referencias, function(r, i) {
//             console.log(i + "/" + total + " : " + r._id._str);
//             res = suggest_annotation(r._id, dicts);
//             annotateRef(r._id, res[0], res[1]);
//         });
//     }
// });



function suggest_annotation(id, dicts) {
    ds = [];
    ts = [];
    _.each(dicts, function(d) {
        _.each(d.words, function(w) {
            console.log(d + " >>> " + w);
            search = new RegExp(w, 'gi');
            referenceElement = Refs.findOne(id);
            _.each(referenceElement.content, function(c){
                if (c.search(search) != -1) {
                    ts.push(w);
                    ds.push(d.dict);
                }
            });
        });
    });
    ds = ds.filter(onlyUnique);
    return [ds, ts];
}



/* Clean data funcions */

function cleanBol(el) {
    if (typeof el.bol !== 'undefined') {
        if (typeof el.bol.bol !== 'undefined') {return el.bol.bol;
        } else {
            return el.bol;
        }
    } else {
        return '';
    }
}
function cleanTramite(el) {
    if (typeof el.tramite !== 'undefined') {
        if (typeof el.tramite.tramite !== 'undefined') {
            return el.tramite.tramite;
        } else {
            return el.tramite;
        }
    } else {
        return '';
    }
}
function cleanUrl(el) {
    if (typeof el.url !== 'undefined') {
        if (typeof el.url.url !== 'undefined') {return el.url.url;
        } else {
            // If it has more than one url, it returns just one
            if (Array.isArray(el.url)) {
                return el.url[0];
            } else {
                return el.url;
            }
        }
    } else {
        return '';
    }
}
function parseAutorDiputado(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.diputado !== 'undefined') && (el.autor.diputado != '')) {
            els = [];
            _.each(el.autor.diputado, function(e){
                els.push(e);
            });
            return els;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorGrupo(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.grupo !== 'undefined') && (el.autor.grupo != '')) {
            els = [];
            _.each(el.autor.grupo, function(e){
                els.push(e);
            });
            return els;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
function parseAutorOtro(el) {
    if (typeof el.autor !== 'undefined') {
        if ((typeof el.autor.otro !== 'undefined') && (el.autor.otro != '')) {
            els = [];
            _.each(el.autor.otro, function(e){
                els.push(e);
            });
            return els;
        } else {
            return [];
        }
    } else {
        return [];
    }
}




function annotateRef(id, _dicts, _terms) {
    if (_dicts.length > 0) {
        r = Refs.findOne(id);
        if ((typeof r.annotate === 'undefined') || (r.annotate == false)) {
            if (typeof r.titulo === 'undefined') {
                titulo = "Sin titulo";
            } else {
                titulo = r.titulo;
            }
            tipi = {
                'titulo': titulo,
                'bol': cleanBol(r),
                'origen': r.origen,
                'ref': r.ref,
                'tipo': r.tipo,
                'tipotexto': r.tipotexto,
                'lugar': r.lugar,
                'fecha': r.fecha,
                'tramite': cleanTramite(r),
                'url': cleanUrl(r),
                'autor_diputado': parseAutorDiputado(r),
                'autor_grupo': parseAutorGrupo(r),
                'autor_otro': parseAutorOtro(r),
                'dicts': _dicts,
                'terms': _terms,
                'relacionadas': [],
                'observaciones': '',
                'quepasocon': '',
                'original': r._id._str
            }
            t = Tipis.insert(tipi);
            if (t) {
                // Tipi successfully inserted
                Refs.update(id, {$set: {dicts: _dicts, terms: _terms, annotate: true, is_tipi: true}});
            } else {
                // Do nothing (this code will be run once again)
            }
        } else {
            // This document is already annotated
        }
    } else {
        Refs.update(id, {$set: {dicts: [], terms: [], annotate: true, is_tipi: false}});
    }
}

/* Tools */

function onlyUnique (value, index, self) { 
    return self.indexOf(value) === index;
}
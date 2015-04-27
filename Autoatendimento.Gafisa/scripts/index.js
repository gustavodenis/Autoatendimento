var onLinePhone = false;
var AlertOffline = false;
var GafisaApp = function () { }

GafisaApp.prototype = function () {

    var langPref = '';
    var _login = true, //false para ativar o login;

    run = function () {

        var that = this;
        $('#home').on('pagebeforecreate', $.proxy(_initHome, that));
        $('#home').on('pageshow', $.proxy(_initLoadHome, that));

        ApplyLangStart();

        TestConnectivity();

        if (window.localStorage.getItem("userInfo") != null) {
            _login = true;
            $.mobile.changePage('#home', { transition: 'flip' });
        }

        $('.RemoveEspecialCharacter').on('keyup', function () {
            $(this).val($(this).val().RemoveEspecialCharacter());
        });

        $('.ForceNumeric').ForceNumericOnly();

        $('#btnLogoff').on('click', function () {
            window.localStorage.clear();
            $.mobile.changePage('#logon', { transition: 'flip' });
        });

        $('.loginBtn').on('click', function () {
            if (window.localStorage.getItem("userInfo") === null) {
                var erro = '';
                if ($('#is_stk').val() == '')
                    erro += getMsgLang(langPref, 'ValidIS');
                if ($('#pass_stk').val() == '')
                    erro += getMsgLang(langPref, 'ValidPass');

                if (erro.length > 0) {
                    alert(getMsgLang(langPref, 'ErrorFound') + erro);
                }
                else {
                    _login = true;
                    if (_login) {
                        var usrdata = [];
                        window.localStorage.setItem("userInfo", JSON.stringify(usrdata));
                        $(this).hide();
                        $.mobile.changePage('#home', { transition: 'flip' });
                    }
                    else {
                        alert(getMsgLang(langPref, 'ErrorLogin'));
                    }
                }
            }

            return false;
        });

        $('#btnLangPT, #btnLangSP, #btnLangEN').on('click', function () {
            window.localStorage.setItem("langPreference", $(this).attr('id').substr(7, 2));
            changeLang($(this).attr('id').substr(7, 2));
        });
    },

    _initHome = function () {
        if (!_login) {
            $.mobile.changePage("#logon", { transition: "flip" });
        }
    },

    _initLoadHome = function () {
    },

    changeLang = function changeLang(lang) {
        langPref = lang;
        if (lang.indexOf("PT") === 0) {
            $(dictionarySTKControls.lang.PT).each(function (i, item) {
                changeLangObj(item.Controle, item.Label);
            });
        }
        else if (lang.indexOf("EN") === 0) {
            $(dictionarySTKControls.lang.EN).each(function (i, item) {
                changeLangObj(item.Controle, item.Label);
            });
        }
        else if (lang.indexOf("SP") === 0) {
            $(dictionarySTKControls.lang.ES).each(function (i, item) {
                changeLangObj(item.Controle, item.Label);
            });
        }
        _initLoadHome();
    },

    getMsgLang = function getMsgLang(lang, IdMsg) {
        var ret = "";
        if (lang.indexOf("PT") === 0) {
            $(dictionarySTKMsg.lang.PT).each(function (i, item) {
                if (item.IdMsg == IdMsg)
                    ret = item.Msg;
            });
        }
        else if (lang.indexOf("EN") === 0) {
            $(dictionarySTKMsg.lang.EN).each(function (i, item) {
                if (item.IdMsg == IdMsg)
                    ret = item.Msg;
            });
        }
        else if (lang.indexOf("SP") === 0) {
            $(dictionarySTKMsg.lang.ES).each(function (i, item) {
                if (item.IdMsg == IdMsg)
                    ret = item.Msg;
            });
        }
        return ret;
    },

    changeLangObj = function changeLangObj(obj, label) {
        var objLabel = $('#' + obj);
        var tag = $(objLabel).get(0).tagName;
        switch (tag) {
            case "SPAN":
                $(objLabel).html(label);
                break;
            case "A":
                $(objLabel).html(label);
                break;
            case "H3":
                $(objLabel).html(label);
                break;
            default:
                $(objLabel).val(label);
                break;
        }
    },

    ApplyLangStart = function ApplyLangStart() {
        if (window.localStorage.getItem("langPreference") != null) {
            langPref = window.localStorage.getItem("langPreference");
            changeLang(window.localStorage.getItem("langPreference"));
        }
        else {
            var language = window.navigator.userLanguage || window.navigator.language;
            switch (language) {
                case "en_us":
                    changeLang("EN");
                    langPref = "EN";
                    break;
                case "es":
                    changeLang("SP");
                    langPref = "SP";
                    break;
                case "pt_br":
                    changeLang("PT");
                    langPref = "PT";
                    break;
                default:
                    changeLang("EN");
                    langPref = "EN";
                    break;
            }
        }
    },

    ShowError = function ShowError(msg) {
        if (onLinePhone)
            alert(msg);
        else {
            if (!AlertOffline)
                alert(getMsgLang(langPref, 'ErrorOnline'));

            AlertOffline = true;
        }
    },

    fauxAjax = function fauxAjax(func, text, thisObj) {
        $.mobile.loading('show', { theme: 'a', textVisible: true, text: text });
        window.setTimeout(function () {
            $.mobile.loading('hide');
            func();
        }, 2000);
    };

    return {
        run: run,
    };
}();

window.jQuery.fn.ForceNumericOnly = function () {
    return this.each(function () {
        $(this).keydown(function (event) {
            console.log(event.keyCode);
            // Allow: backspace, delete, tab, escape, enter, "," and dot
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 190 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            } else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
    });
};

String.prototype.RemoveEspecialCharacter = function (e) {
    return this.replace(/[^a-z0-9]/gi, ' ');
};

var dictionarySTKMsg = {
    "lang": {
        "PT": [
            { "IdMsg": "Loading", "Msg": "Carregando..." },
            { "IdMsg": "Deleting", "Msg": "Excluindo..." },
            { "IdMsg": "ErrorFound", "Msg": "Erros encontrados:\n" },
            { "IdMsg": "ErrorAjax", "Msg": "Erro no processamento!" },
            { "IdMsg": "ConfirmDelete", "Msg": "Deseja Excluir o item?" },
            { "IdMsg": "ErrorDeleteReg", "Msg": "Erro ao excluir o registro!" },
            { "IdMsg": "PermissionPage", "Msg": "Você não possui permissão para acessar esta página!" },
            { "IdMsg": "Authenticating", "Msg": "Autenticando..." },
            { "IdMsg": "ValidIS", "Msg": "- IS\n" },
            { "IdMsg": "ValidPass", "Msg": "- Senha\n" },
            { "IdMsg": "ValidDate", "Msg": "- Data é obrigatório\n" },
            { "IdMsg": "ValidDateBegin", "Msg": "- Data Início é obrigatório\n" },
            { "IdMsg": "ValidDateEnd", "Msg": "- Data Final é obrigatório\n" },
            { "IdMsg": "ValidHour", "Msg": "- Horas é obrigatório\n" },
            { "IdMsg": "ValidProject", "Msg": "- Projeto é obrigatório\n" },
            { "IdMsg": "ValidActivity", "Msg": "- Atividade é obrigatório\n" },
            { "IdMsg": "ValidDescription", "Msg": "- Descrição é obrigatório\n" },
            { "IdMsg": "ValidHourEntrance", "Msg": "- Horas de Entrada é obrigatório\n" },
            { "IdMsg": "DataSaveSuccess", "Msg": "Registro salvo com sucesso!" },
            { "IdMsg": "DataSaveError", "Msg": "Erro ao salvar o registro!" },
            { "IdMsg": "SelCombo", "Msg": "Selecione..." },
            { "IdMsg": "TypeOfDiscount", "Msg": "Tipo de Desconto" },
            { "IdMsg": "LabelHours", "Msg": "Horas" },
            { "IdMsg": "LabelTotal", "Msg": "Total" },
            { "IdMsg": "LabelBHour", "Msg": "B. Horas: " },
            { "IdMsg": "LabelPVaca", "Msg": "P. Férias: " },
            { "IdMsg": "LabelAllow", "Msg": "Abono: " },
            { "IdMsg": "RegValidated", "Msg": "O Tipo de Atividade devem ser iguais para aprovação em lote!" },
            { "IdMsg": "DateRepInvalid", "Msg": "- Data de Replicação inválida!\n" },
            { "IdMsg": "ApproveMass", "Msg": "Não é possível aprovar em massa!" },
            { "IdMsg": "Approved", "Msg": "Aprovado" },
            { "IdMsg": "Repproved", "Msg": "Reprovado" },
            { "IdMsg": "DateWeekStartInvalid", "Msg": "- Data Inicial não liberada para lançamento.\n" },
            { "IdMsg": "DateWeekFinishInvalid", "Msg": "- Data Final não liberada para lançamento.\n" },
            { "IdMsg": "ValidMaxNormalHour", "Msg": "- Máximo 8 horas permitido.\n" },
            { "IdMsg": "ValidMaxAditionalHour", "Msg": "- Máximo 16 horas permitido.\n" },
            { "IdMsg": "ErrorLogin", "Msg": "Usuário ou senha inválidos!" },
            { "IdMsg": "ErrorOnline", "Msg": "Você está sem conexão!" }
        ],
        "EN": [
            { "IdMsg": "Loading", "Msg": "Loading..." },
            { "IdMsg": "Deleting", "Msg": "Deleting..." },
            { "IdMsg": "ErrorFound", "Msg": "Found errors:\n" },
            { "IdMsg": "ErrorAjax", "Msg": "Error on process!" },
            { "IdMsg": "ConfirmDelete", "Msg": "Comfirm delete this item?" },
            { "IdMsg": "ErrorDeleteReg", "Msg": "Error deleting the data!" },
            { "IdMsg": "PermissionPage", "Msg": "You don´t have permission to access this page!" },
            { "IdMsg": "Authenticating", "Msg": "Authenticating..." },
            { "IdMsg": "ValidIS", "Msg": "- IS\n" },
            { "IdMsg": "ValidPass", "Msg": "- Password\n" },
            { "IdMsg": "ValidDate", "Msg": "- Date is required.\n" },
            { "IdMsg": "ValidDateBegin", "Msg": "- Date Begin is required.\n" },
            { "IdMsg": "ValidDateEnd", "Msg": "- Date End is required.\n" },
            { "IdMsg": "ValidHour", "Msg": "- Hours is required.\n" },
            { "IdMsg": "ValidProject", "Msg": "- Project is required.\n" },
            { "IdMsg": "ValidActivity", "Msg": "- Activity is required.\n" },
            { "IdMsg": "ValidDescription", "Msg": "- Description is required.\n" },
            { "IdMsg": "ValidHourEntrance", "Msg": "- Entrance Hours is required.\n" },
            { "IdMsg": "DataSaveSuccess", "Msg": "Data save!" },
            { "IdMsg": "DataSaveError", "Msg": "Error saving the data!" },
            { "IdMsg": "SelCombo", "Msg": "Select..." },
            { "IdMsg": "TypeOfDiscount", "Msg": "Type of Discount" },
            { "IdMsg": "LabelHours", "Msg": "Hours" },
            { "IdMsg": "LabelTotal", "Msg": "Total" },
            { "IdMsg": "LabelBHour", "Msg": "B. Hours: " },
            { "IdMsg": "LabelPVaca", "Msg": "P. Vaca: " },
            { "IdMsg": "LabelAllow", "Msg": "Allowance: " },
            { "IdMsg": "RegValidated", "Msg": "Record was validate by your Manager!" },
            { "IdMsg": "RegValidated", "Msg": "The activity type must be the same for batch approval!" },
            { "IdMsg": "DateRepInvalid", "Msg": "- Replication Date is invalid!\n" },
            { "IdMsg": "ApproveMass", "Msg": "Don´t is possible mass approvation!" },
            { "IdMsg": "Approved", "Msg": "Approved" },
            { "IdMsg": "Repproved", "Msg": "Disapproved" },
            { "IdMsg": "DateWeekStartInvalid", "Msg": "- Start Date don´t avaliable.\n" },
            { "IdMsg": "DateWeekFinishInvalid", "Msg": "- Finish Date don´t avaliable.\n" },
            { "IdMsg": "ValidMaxNormalHour", "Msg": "- Max 8 hours allowed.\n" },
            { "IdMsg": "ValidMaxAditionalHour", "Msg": "- Max 16 hours allowed.\n" },
            { "IdMsg": "ErrorLogin", "Msg": "Invalid user or password!" },
            { "IdMsg": "ErrorOnline", "Msg": "You´re offline!" }
        ],
        "ES": [
            { "IdMsg": "Loading", "Msg": "Carregando..." },
            { "IdMsg": "Deleting", "Msg": "Excluindo..." },
            { "IdMsg": "ErrorFound", "Msg": "Errores econtrados:\n" },
            { "IdMsg": "ErrorAjax", "Msg": "Error al processar!" },
            { "IdMsg": "ConfirmDelete", "Msg": "Querer eliminar el registro?" },
            { "IdMsg": "ErrorDeleteReg", "Msg": "Error al borrar el registro!" },
            { "IdMsg": "PermissionPage", "Msg": "Usted no tiene permiso para acceder a esta página!" },
            { "IdMsg": "Authenticating", "Msg": "Autenticación..." },
            { "IdMsg": "ValidIS", "Msg": "- IS\n" },
            { "IdMsg": "ValidPass", "Msg": "- Contraseña\n" },
            { "IdMsg": "ValidDate", "Msg": "- Fecha se requiere.\n" },
            { "IdMsg": "ValidDateBegin", "Msg": "- Fecha Inicio se requiere.\n" },
            { "IdMsg": "ValidDateEnd", "Msg": "- Fecha Finalización se requiere.\n" },
            { "IdMsg": "ValidHour", "Msg": "- Horas se requiere.\n" },
            { "IdMsg": "ValidProject", "Msg": "- Proyecto se requiere.\n" },
            { "IdMsg": "ValidActivity", "Msg": "- Actividad se requiere.\n" },
            { "IdMsg": "ValidDescription", "Msg": "- Descripción se requiere.\n" },
            { "IdMsg": "ValidHourEntrance", "Msg": "- Horas de Entrada se requiere.\n" },
            { "IdMsg": "DataSaveSuccess", "Msg": "Registro guardado!" },
            { "IdMsg": "DataSaveError", "Msg": "Erro al guardar lo registro!" },
            { "IdMsg": "SelCombo", "Msg": "Seleccionar..." },
            { "IdMsg": "TypeOfDiscount", "Msg": "Tipo de Descuento" },
            { "IdMsg": "LabelHours", "Msg": "Horas" },
            { "IdMsg": "LabelTotal", "Msg": "Total" },
            { "IdMsg": "LabelBHour", "Msg": "B. Horas: " },
            { "IdMsg": "LabelPVaca", "Msg": "P. Vacaciones: " },
            { "IdMsg": "LabelAllow", "Msg": "Conseción: " },
            { "IdMsg": "RegValidated", "Msg": "Registro ha sido validado por el Gerente!" },
            { "IdMsg": "RegValidated", "Msg": "El tipo de actividad debe ser el mismo para su aprobación por lotes!" },
            { "IdMsg": "DateRepInvalid", "Msg": "- El fecha de replicacion es incorreta!\n" },
            { "IdMsg": "ApproveMass", "Msg": "No es possible aprobar em massa!" },
            { "IdMsg": "Approved", "Msg": "Aprobado" },
            { "IdMsg": "Repproved", "Msg": "Reprobado" },
            { "IdMsg": "DateWeekStartInvalid", "Msg": "- Fecha Inicial sin despachar para la liberación.\n" },
            { "IdMsg": "DateWeekFinishInvalid", "Msg": "- Fecha Final sin despachar para la liberación.\n" },
            { "IdMsg": "ValidMaxNormalHour", "Msg": "- Máximo 8 horas permitido.\n" },
            { "IdMsg": "ValidMaxAditionalHour", "Msg": "- Máximo 16 horas permitido.\n" },
            { "IdMsg": "ErrorLogin", "Msg": "Usuário o contraseña no válidos!" },
            { "IdMsg": "ErrorOnline", "Msg": "Usted no se ha conectado!" }
        ]
    }
};

var dictionarySTKControls = {
    "lang": {
        "PT": [
            { "Controle": "hrNormal", "Label": "Normal" },
            { "Controle": "hrAditional", "Label": "Adicionais" },
            { "Controle": "hrFault", "Label": "Ausência" },
            { "Controle": "hrAprover", "Label": "Aprovar" },
            { "Controle": "labelIS", "Label": "IS:" },
            { "Controle": "labelPass", "Label": "Senha:" },
            { "Controle": "loginBtn", "Label": "Login" },
            { "Controle": "labelDateBegin", "Label": "Data Início:" },
            { "Controle": "labelDateEnd", "Label": "Data Final:" },
            { "Controle": "labelHours", "Label": "Hora:" },
            { "Controle": "labelHourNormal", "Label": "Horas Normais" },
            { "Controle": "labelWeek", "Label": "Semana:" },
            { "Controle": "btnAddHours", "Label": "Adicionar" },
            { "Controle": "btnCancelHour", "Label": "Cancelar" },
            { "Controle": "labelProject", "Label": "Projeto:" },
            { "Controle": "labelAcitivity", "Label": "Atividade" },
            { "Controle": "labelDescription", "Label": "Descrição" },
            { "Controle": "labelReplyLanc", "Label": "Replicar Lançamentos" },
            { "Controle": "btnAddNormalHour", "Label": "Salvar" },
            { "Controle": "btnCancelNormalHour", "Label": "Cancelar" },
            { "Controle": "labelHourAditional", "Label": "Horas Adicionais" },
            { "Controle": "btnAddAditionalHours", "Label": "Adicionar" },
            { "Controle": "btnCancelHour", "Label": "Cancelar" },
            { "Controle": "labelDate", "Label": "Data:" },
            { "Controle": "labelHourBegin", "Label": "Hora Entrada:" },
            { "Controle": "btnAddAditionalHour", "Label": "Salvar" },
            { "Controle": "btnCancelAditionalHour", "Label": "Cancelar" },
            { "Controle": "btnSaveApprove", "Label": "Gravar" },
            { "Controle": "btnReproveApprove", "Label": "Reprovar" },
            { "Controle": "btnApprove", "Label": "Aprovar" },
            { "Controle": "btnCancelAprove", "Label": "Cancelar" },
            { "Controle": "labelFault", "Label": "Ausência" },
            { "Controle": "btnSaveFaultHours", "Label": "Salvar" },
            { "Controle": "btnCancelFaultHours", "Label": "Cancelar" },
            { "Controle": "label_ISName", "Label": "Nome Colaborador:" },
            { "Controle": "label_Lang", "Label": "Idioma:" },
            { "Controle": "label_Platform", "Label": "Plataforma:" },
            { "Controle": "btnLogoff", "Label": "Sair" },
            { "Controle": "labelApprovation", "Label": "Aprovação" }
        ],
        "EN": [
            { "Controle": "hrNormal", "Label": "Normal" },
            { "Controle": "hrAditional", "Label": "Aditional" },
            { "Controle": "hrFault", "Label": "Vacation" },
            { "Controle": "hrAprover", "Label": "Approve" },
            { "Controle": "labelIS", "Label": "IS:" },
            { "Controle": "labelPass", "Label": "Password:" },
            { "Controle": "loginBtn", "Label": "Login" },
            { "Controle": "labelDateBegin", "Label": "Date Begin:" },
            { "Controle": "labelDateEnd", "Label": "Date End:" },
            { "Controle": "labelHours", "Label": "Hour:" },
            { "Controle": "labelHourNormal", "Label": "Normal Hours" },
            { "Controle": "labelWeek", "Label": "Week:" },
            { "Controle": "btnAddHours", "Label": "Add" },
            { "Controle": "btnCancelHour", "Label": "Cancel" },
            { "Controle": "labelProject", "Label": "Project:" },
            { "Controle": "labelAcitivity", "Label": "Activity" },
            { "Controle": "labelDescription", "Label": "Description" },
            { "Controle": "labelReplyLanc", "Label": "Reply Hours" },
            { "Controle": "btnAddNormalHour", "Label": "Save" },
            { "Controle": "btnCancelNormalHour", "Label": "Cancel" },
            { "Controle": "labelHourAditional", "Label": "Aditional Hours" },
            { "Controle": "btnAddAditionalHours", "Label": "Add" },
            { "Controle": "btnCancelHour", "Label": "Cancel" },
            { "Controle": "labelDate", "Label": "Date:" },
            { "Controle": "labelHourBegin", "Label": "Hour Entrance:" },
            { "Controle": "btnAddAditionalHour", "Label": "Save" },
            { "Controle": "btnCancelAditionalHour", "Label": "Cancel" },
            { "Controle": "btnSaveApprove", "Label": "Save" },
            { "Controle": "btnReproveApprove", "Label": "Disapprove" },
            { "Controle": "btnApprove", "Label": "Approve" },
            { "Controle": "btnCancelAprove", "Label": "Cancel" },
            { "Controle": "labelFault", "Label": "Absence" },
            { "Controle": "btnSaveFaultHours", "Label": "Save" },
            { "Controle": "btnCancelFaultHours", "Label": "Cancel" },
            { "Controle": "label_ISName", "Label": "Resource Name:" },
            { "Controle": "label_Lang", "Label": "Language:" },
            { "Controle": "label_Platform", "Label": "Plataform:" },
            { "Controle": "btnLogoff", "Label": "Logoff" },
            { "Controle": "labelApprovation", "Label": "Approvation" }
        ],
        "ES": [
            { "Controle": "hrNormal", "Label": "Normal" },
            { "Controle": "hrAditional", "Label": "Adicional" },
            { "Controle": "hrFault", "Label": "Ausencia" },
            { "Controle": "hrAprover", "Label": "Aprobar" },
            { "Controle": "labelIS", "Label": "IS:" },
            { "Controle": "labelPass", "Label": "Contasenã:" },
            { "Controle": "loginBtn", "Label": "Iniciar sesión" },
            { "Controle": "labelDateBegin", "Label": "Fecha de Inicio:" },
            { "Controle": "labelDateEnd", "Label": "Fecha de Finalización:" },
            { "Controle": "labelHours", "Label": "Hora:" },
            { "Controle": "labelHourNormal", "Label": "Horas Normales" },
            { "Controle": "labelWeek", "Label": "Semana:" },
            { "Controle": "btnAddHours", "Label": "Anãdir" },
            { "Controle": "btnCancelHour", "Label": "Cancelar" },
            { "Controle": "labelProject", "Label": "Proyecto:" },
            { "Controle": "labelAcitivity", "Label": "Actividad" },
            { "Controle": "labelDescription", "Label": "Descripción" },
            { "Controle": "labelReplyLanc", "Label": "Replicar Horas" },
            { "Controle": "btnAddNormalHour", "Label": "Guardar" },
            { "Controle": "btnCancelNormalHour", "Label": "Cancelar" },
            { "Controle": "labelHourAditional", "Label": "Horas Adicionales" },
            { "Controle": "btnAddAditionalHours", "Label": "Anãdir" },
            { "Controle": "btnCancelHour", "Label": "Cancelar" },
            { "Controle": "labelDate", "Label": "Fecha:" },
            { "Controle": "labelHourBegin", "Label": "Hora de llegada:" },
            { "Controle": "btnAddAditionalHour", "Label": "Guardar" },
            { "Controle": "btnCancelAditionalHour", "Label": "Cancelar" },
            { "Controle": "btnSaveApprove", "Label": "Guardar" },
            { "Controle": "btnReproveApprove", "Label": "Disaprobar" },
            { "Controle": "btnApprove", "Label": "Aprobar" },
            { "Controle": "btnCancelAprove", "Label": "Cancelar" },
            { "Controle": "labelFault", "Label": "Ausencia" },
            { "Controle": "btnSaveFaultHours", "Label": "Guardar" },
            { "Controle": "btnCancelFaultHours", "Label": "Cancelar" },
            { "Controle": "label_ISName", "Label": "Nombre Colaborador:" },
            { "Controle": "label_Lang", "Label": "Lengua:" },
            { "Controle": "label_Platform", "Label": "Plataforma:" },
            { "Controle": "btnLogoff", "Label": "Desconectar" },
            { "Controle": "labelApprovation", "Label": "Aprobacion" }
        ]
    }
};

function TestConnectivity() {
    $.ajax({
        type: "GET",
        url: "https://intrasoft.softtek.com/wssra/products.json", //url: "http://istkbr03338.softtek.com.br/wssra/products.json",
        dataType: "json",
        timeout: 5000
    }).done(function (data) {
        onLinePhone = true;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        onLinePhone = false;
    });
}

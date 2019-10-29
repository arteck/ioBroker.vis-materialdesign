/*
    ioBroker.vis vis-materialdesign Widget-Set

    version: "0.1.7"

    Copyright 2019 Scrounger scrounger@gmx.net
*/
"use strict";

// this code can be placed directly in materialdesign.html
vis.binds.materialdesign.select = {
    initialize: function (data, isBooleanSelect = false) {
        try {
            let selectElementList = [];


            let iconHeight = getValueFromData(data.drawerIconHeight, '', 'height: ', 'px !important;');
            let menuItemFontSize = getFontSize(data.listItemTextSize);
            let spaceBetweenImageAndLabel = getValueFromData(data.distanceBetweenTextAndImage, '', 'margin-right: ', 'px;');

            let selectElement = '';
            let labelledbyAttribute = '';
            let labelElement = '';

            if (data.layout === 'standard') {
                selectElement = '<div class="mdc-select" style="width: 100%;">'
                labelledbyAttribute = 'filled_enhanced filled_enhanced-label';

                labelElement = `<span class="mdc-floating-label mdc-floating-label--float-above">${getValueFromData(data.hintText, '')}</span>
                                <div class="mdc-line-ripple"></div>`
            } else {
                selectElement = '<div class="mdc-select mdc-select--outlined" style="width: 100%;">'
                labelledbyAttribute = 'shaped_filled_enhanced shaped_filled_enhanced-label';

                labelElement = `<div class="mdc-line-ripple"></div>
                                <div class="mdc-notched-outline">
                                    <div class="mdc-notched-outline__leading"></div>
                                    <div class="mdc-notched-outline__notch">
                                        <label class="mdc-floating-label">${getValueFromData(data.hintText, '')}</label>
                                    </div>
                                    <div class="mdc-notched-outline__trailing"></div>
                                </div>`
            }

            let imageElement = '';
            let listElements = [];
            let rightItemLabel = '';

            if (isBooleanSelect) {
                // Bool Select
                let image = getValueFromData(data.image, null);
                let imageTrue = getValueFromData(data.imageTrue, null);

                if (image != null || imageTrue != null) {
                    selectElement = $($.parseHTML(selectElement)).addClass('mdc-select--with-leading-icon').get(0).outerHTML.replace('</div>', '');
                    imageElement = `<img class="material-icons mdc-select__icon" tabindex="0" role="button" src="${image}" />`;
                }

                listElements.push(`${getListItem('standard', 0, '', false, false, iconHeight, '', '', false)}
                                                ${(image != null) ? getListItemImage(image, `${iconHeight}${spaceBetweenImageAndLabel}`) : ''}
                                                ${getListItemLabel('standard', 0, getValueFromData(data.text_false, 'Item false'), false, menuItemFontSize, '', 0)}</div>`)

                listElements.push(`${getListItem('standard', 1, '', false, false, iconHeight, '', '', true)}
                                                ${(imageTrue != null) ? getListItemImage(imageTrue, `${iconHeight}${spaceBetweenImageAndLabel}`) : ''}
                                                ${getListItemLabel('standard', 1, getValueFromData(data.text_true, 'Item true'), false, menuItemFontSize, '', 0)}</div>`)

            } else {
                // Value Select
                let imageExists = false;
                let initialeImage = '';

                for (var i = 0; i <= data.values; i++) {
                    let menuIcon = getValueFromData(data.attr('menuIcon' + i), null);

                    listElements.push(`${getListItem('standard', i, '', false, false, iconHeight, '', '', getValueFromData(data.attr('value' + i), ''))}
                                                ${(menuIcon != null) ? getListItemImage(menuIcon, `${iconHeight}${spaceBetweenImageAndLabel}`) : ''}
                                                ${getListItemLabel('standard', 0, getValueFromData(data.attr('label' + i), getValueFromData(data.attr('value' + i), `no value for Item ${i}`)), false, menuItemFontSize, '', 0)}`)

                    if (menuIcon !== null) {
                        imageExists = true;
                        initialeImage = menuIcon;
                    }

                    rightItemLabel = getListItemLabel('standard', i, getValueFromData(data.attr('value' + i)), false, menuItemFontSize, '', '', '');
                    rightItemLabel = $($.parseHTML(rightItemLabel)).css('width', 'auto');
                    rightItemLabel = rightItemLabel.addClass('materialdesign-list-item-text-right').addClass('mdc-list-item__meta').get(0).outerHTML;
                    
                    listElements.push(rightItemLabel);
                    listElements.push('</div>')
                }

                if (imageExists) {
                    selectElement = $($.parseHTML(selectElement)).addClass('mdc-select--with-leading-icon').get(0).outerHTML.replace('</div>', '');
                    imageElement = `<img class="material-icons mdc-select__icon" tabindex="0" role="button" src="${initialeImage}" />`;
                }
            }

            selectElementList.push(`${selectElement}
                                        ${imageElement}
                                        <input type="hidden" name="enhanced-select">
                                        <i class="mdc-select__dropdown-icon"></i>
                                        <div id="filled_enhanced" class="mdc-select__selected-text" role="button" aria-haspopup="listbox" aria-labelledby="${labelledbyAttribute}"></div>
                                        <div class="mdc-select__menu mdc-menu mdc-menu-surface">
                                            <ul class="mdc-list">
                                                ${listElements.join('')}
                                            </ul>
                                        </div>
                                        ${labelElement}
                                    </div>`);

            return selectElementList.join('');

        } catch (ex) {
            console.exception(`initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    handleBoolean: function (el, data, isBooleanSelect) {
        try {
            setTimeout(function () {
                var $this = $(el);
                let select = $this.find('.mdc-select').get(0);
                let list = $this.find('.mdc-list').get(0);

                const mdcSelect = new mdc.select.MDCSelect(select);
                const mdcList = new mdc.list.MDCList(list);
                const listItemRipples = mdcList.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));

                select.style.setProperty("--materialdesign-color-select-background", getValueFromData(data.selectBackground, ''));
                select.style.setProperty("--materialdesign-color-select-background-hover", getValueFromData(data.selectBackgroundHover, ''));
                select.style.setProperty("--materialdesign-color-select-hint", getValueFromData(data.selectHintTextColor, ''));
                select.style.setProperty("--materialdesign-color-select-hint_selected", getValueFromData(data.selectHintTextColorSelected, ''));
                select.style.setProperty("--materialdesign-color-select-border", getValueFromData(data.selectBorderColor, ''));
                select.style.setProperty("--materialdesign-color-select-border-selected", getValueFromData(data.selectBorderColorSelected, ''));

                let colorDrawerBackground = getValueFromData(data.colorDrawerBackground, '');
                list.style.setProperty("--materialdesign-color-drawer-background", colorDrawerBackground);
                list.style.setProperty("--materialdesign-color-list-item-background", getValueFromData(data.colorDrawerItemBackground, colorDrawerBackground));
                list.style.setProperty("--materialdesign-color-list-item-selected", getValueFromData(data.colorListItemSelected, ''));
                list.style.setProperty("--materialdesign-color-list-item-hover", getValueFromData(data.colorListItemHover, ''));
                list.style.setProperty("--materialdesign-color-list-item-text", getValueFromData(data.colorListItemText, ''));
                list.style.setProperty("--materialdesign-color-list-item-text-activated", getValueFromData(data.colorListItemTextSelected, ''));


                setSelectState(vis.states.attr(data.oid + '.val'));

                vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                    setSelectState(newVal);
                });

                if (!vis.editMode) {
                    mdcSelect.listen('MDCSelect:change', function () {
                        console.log(mdcSelect.value);
                        if (isBooleanSelect) {
                            vis.setValue(data.oid, (mdcSelect.value === 'true') ? true : false);
                        } else {
                            vis.setValue(data.oid, mdcSelect.value);
                        }
                    });
                }

                function setSelectState(val) {

                    if (isBooleanSelect) {
                        if (val) {
                            mdcSelect.selectedIndex = 1;
                            mdcList.selectedIndex = 1;
                            $this.find('.material-icons').attr('src', getValueFromData(data.imageTrue, ''))
                        } else {
                            mdcSelect.selectedIndex = 0;
                            mdcList.selectedIndex = 0;
                            $this.find('.material-icons').attr('src', getValueFromData(data.image, ''))
                        }
                    } else {
                        for (var i = 0; i <= data.values; i++) {
                            if (val.toString() === getValueFromData(data.attr('value' + i), '').toString()) {
                                mdcSelect.selectedIndex = i;
                                mdcList.selectedIndex = i;
                                $this.find('.material-icons').attr('src', getValueFromData(data.attr('menuIcon' + i), ''))
                                
                                break;
                            }
                        }
                    }
                };
            }, 1);

        } catch (ex) {
            console.exception(`handleBoolean: error: ${ex.message}, stack: ${ex.stack}`);
        }
    }
};
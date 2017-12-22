//Inspired from https://messente.com/sms/calculator

(function (root, factory) {
	if ('object' === typeof exports) {
		var charset = require('./charset.json');
		module.exports = factory(charset);

	} else {
			root.GsmUMD = factory();
			// return (root['someModuleName'] = factory(foo));
	}

})(this, function (charset) {
	var GsmUMD = function (customfield) {
		if( charset === undefined) {
			this.charset7bit = {
				"0": 1,  "1": 1,  "2": 1,  "3": 1,  "4": 1,  "5": 1,  "6": 1,  "7": 1,  "8": 1,  "9": 1,  "LF": 1,  "CR": 1,  "SP": 1,  "!": 1,  "\"": 1,  "#": 1,  "$": 1,  "%": 1,  "&": 1,  "'": 1,  "(": 1,  ")": 1,  "*": 1,  "+": 1,
				",": 1,  "-": 1,  ".": 1,  "/": 1,  ":": 1,  ";": 1,  "<": 1,  "=": 1,  ">": 1,  "?": 1,  "@": 1,  "A": 1,  "B": 1,  "C": 1,  "D": 1,  "E": 1,  "F": 1,  "G": 1,  "H": 1,  "I": 1,  "J": 1,  "K": 1,  "L": 1,  "M": 1,  "N": 1,  "O": 1,  "P": 1,  "Q": 1,  "R": 1,  "S": 1,  "T": 1,  "U": 1,  "V": 1,  "W": 1,  "X": 1,  "Y": 1,  "Z": 1,  "[": 2,  "\\\\": 2,  "]": 2,  "^": null,  "_": 1,  "`": null,  "a": 1,  "b": 1,  "c": 1,  "d": 1,  "e": 1,  "f": 1,  "g": 1,  "h": 1,  "i": 1,  "j": 1,  "k": 1,  "l": 1,  "m": 1,  "n": 1,  "o": 1,  "p": 1,  "q": 1,  "r": 1,  "s": 1,  "t": 1,  "u": 1,  "v": 1,  "w": 1,  "x": 1,  "y": 1,  "z": 1,  "{": 2,  "|": 2,  "}": 2,  "~": null,  "¡": 2,  "¢": null,  "£": 2,  "¤": 2,  "¥": 2,  "¦": null,  "§": 2,  "¨": null,  "©": null,  "ª": null,  "«": null,  "¬": null,  "­": null,  "®": null,  "¯": null,  "°": null,  "±": null,  "²": null,  "³": null,  "´": null,  "µ": null,  "¶": null,  "·": null,  "¸": null,  "¹": null,  "º": null,  "»": null,  "¼": null,  "½": null,  "¾": null,  "¿": 2,  "À": "A",  "Á": "A",  "Â": "A",  "Ã": "A",  "Ä": 2,  "Å": 2,  "Æ": 2,  "Ç": "C",  "È": "E",  "É": 2,  "Ð": null,  "Ñ": 2,  "Ò": "O",  "Ó": "O",  "Ô": "O",  "Õ": "O",  "Ö": 2,  "×": null,  "Ø": 2,  "Ù": "U",  "Ú": "U",  "Û": "U",  "Ü": 2,  "Ý": "Y",  "Þ": null,  "ß": 2,  "à": 2,  "á": "a",  "â": "a",  "ã": "a",  "ä": 2,  "å": 2,  "æ": 2,  "ç": "c",  "è": 2,  "é": 1,  "ê": "e",  "ë": "e",  "ì": 2,  "í": "i",  "î": "i",  "ï": "i",  "ð": null,  "ñ": 2,  "ò": 2,  "ó": "o",  "ô": "o",  "õ": "o",  "ö": 2,  "÷": null,  "ø": 2,  "ù": 2,  "ú": "u",  "û": "u",  "ü": 2,  "ý": "y",  "þ": null,  "ÿ": "y",  "€": 2,  " ": 1
			};
		} else {
			this.charset7bit = charset;
		}
		this.customfield = customfield || {};
	}
	GsmUMD.regexCustomField = /\[\[([a-zA-Z0-9\-\_\+ ]+)\]\]/g;

	GsmUMD.linkRegex = /((https?:\/\/|[a-zA-Z0-9\-_]+\.[a-zA-Z0-9]+)[^ \n\r]+)/;
	GsmUMD.ipRegex = /^([1-9][0-9]{0,2}\.){3}([1-9][0-9]{0,2})$/;
	GsmUMD.numberWithDot = /^([0-9][0-9]{0,2}\.){1,}([1-9][0-9]{0,2})\.?$/;

	GsmUMD.globalLinkRegex = new RegExp(GsmUMD.linkRegex.source, 'g');

	GsmUMD.prototype = {
		setCustomFields: function(customfield){
			this.customfield = customfield;
		},
		check: function (content, opts) {
			var fragmentedContent = this._findCustom(content);
			var use_7bit = true;
			var length_7bit = 0;
			var length_16bit = 0;
			var wrongChar = [];
			var notSupportedChar = [];
			var replacedChars = {};
			for (var j = 0; j < fragmentedContent.length; j++) {
				var replacedContent = "";
				var matches;
				if (typeof fragmentedContent[j] === "object") {
					matches = fragmentedContent[j].replaceTo;
				} else {
					matches = fragmentedContent[j].split("");
				}
				for (var i = 0; i < matches.length; i++) {
					var charToCheck = matches[i];

					// if (use_7bit && this.charset7bit[charToCheck] === undefined) {
					// use_7bit = false;
					// wrongChar.push(charToCheck);
					// }

					// if (use_7bit) {
					// length_7bit += this.charset7bit[charToCheck];
					// }
					// console.warn(this.charset7bit[charToCheck])
					if (use_7bit) {
						if (this.charset7bit[charToCheck] === undefined) {
							if (wrongChar.indexOf(charToCheck) < 0) {
								wrongChar.push(charToCheck);
							}
							notSupportedChar.push(charToCheck)
						} else if (this.charset7bit[charToCheck] === null) {
							if (wrongChar.indexOf(charToCheck) < 0) {
								wrongChar.push(charToCheck);
							}
						} else {
							if (typeof this.charset7bit[charToCheck] === 'string') {
								length_7bit += this.charset7bit[this.charset7bit[charToCheck]]
								if (typeof fragmentedContent[j] === "string") {
									replacedChars[charToCheck] = this.charset7bit[charToCheck]
								}
								charToCheck = this.charset7bit[charToCheck];
							} else {
								length_7bit += this.charset7bit[charToCheck];
							}
						}
					}
					length_16bit++;
					replacedContent += charToCheck;
				}
				if (typeof fragmentedContent[j] === "string" && replacedContent !== fragmentedContent[j]) {
					fragmentedContent[j] = replacedContent;
				}
			}
			// if (use_7bit) {
			parts = this.smsCount(length_7bit, false);
			// } else {
			// 	parts = this.smsCount(length_16bit, true);
			// }

			parts.wrong_chars = wrongChar;
			parts.notsupported_chars = notSupportedChar;
			parts.replaced_chars = replacedChars;
			if (Object.keys(replacedChars).length > 0) {					
				const result = this._generateReplacedContent(fragmentedContent);

				parts.replaced_content = result.replacedContent;
				parts.replaced_content_html = result.replacedContentHtml;
			}
			return parts;
		},
		smsCount: function (chars, enc_16) {
			var characters_left = 0;
			var sms_count = 0;

			if (!enc_16 && chars <= 160) {
				characters_left = 160 - chars;
				return {
					'sms_count': 1,
					'count': chars,
					'chars_left': characters_left,
					"char_set": "GSM 03.38"
				};
			}

			if (enc_16 && chars <= 70) {
				characters_left = 70 - chars;
				return {
					'sms_count': 1,
					'count': chars,
					'chars_left': characters_left,
					"char_set": "Unicode"
				};
			}

			if (!enc_16) {
				sms_count = Math.ceil(chars / 153);
				characters_left = (sms_count * 153) - chars;
				return {
					'sms_count': sms_count,
					'count': chars,
					'chars_left': characters_left,
					"char_set": "GSM 03.38"
				};
			} else {
				sms_count = Math.ceil(chars / 67);
				characters_left = (sms_count * 67) - chars;
				return {
					'sms_count': sms_count,
					'count': chars,
					'chars_left': characters_left,
					"char_set": "Unicode"
				};
			}
		},
		/**
		 * @typedef {Object} fragment
		 * @property {string} found - the orginal customField found in the content.
		 * @property {string} replaceTo - the string to replace the customField(used for counting message length).
		*/
		/**
		 * generate an array that split the content by customField
		 * @param {string} content : the content to fragment
		 * @returns {fragment|string[]}
		 */
		_findCustom: function (content) {
			var currentIndex = 0;
			var index = [];
			var fragmentedContent = [];
			while (match = GsmUMD.regexCustomField.exec(content)) {
				if (currentIndex !== match.index) {
					fragmentedContent.push(content.substring(currentIndex, match.index));
				}
				var replaceTo;
				switch (typeof this.customfield[match[1]]) {
					case 'undefined':
						replaceTo = "";
						break;
					case 'string':
						replaceTo = this.customfield[match[1]];
						break;
					case 'number':
						replaceTo = "a".repeat(this.customfield[match[1]]);
						break;
					default:
						break;
				}

				currentIndex = match.index + match[0].length;

				fragmentedContent.push({ found: match[0], replaceTo: replaceTo })
			}
			
			if (fragmentedContent.length === 0) {
				fragmentedContent.push(content);
			}

			if (currentIndex !== content.length) {
				fragmentedContent.push(content.substring(currentIndex, content.length));
			}

			return fragmentedContent;	
		},
		/**
		 * unused function
		 */
		_replaceCustomFields: function (content, customFieldFound) {
			var contentReplaced = content;
			var keys = Object.keys(customFieldFound);
			for (var i = keys.length - 1; i >= 0; i--) {
				var index = keys[i];
				contentReplaced = contentReplaced.substring(0, index) + customFieldFound[index].replaceTo + contentReplaced.substring(Number.parseInt(index) + customFieldFound[index].found.length, contentReplaced.length)
			}
			return contentReplaced;
		},
		/**
		 * unused function
		 */
		_setOriginalCustomFields: function (contentReplaced, customFieldFound) {
			for (var index in customFieldFound) {
				contentReplaced = contentReplaced.substring(0, index) + customFieldFound[index].found + contentReplaced.substring(Number.parseInt(index) + customFieldFound[index].replaceTo.length, contentReplaced.length)
			}

			return contentReplaced;
		},
		/**
		 * Recreate the original content with the customFields but change all characters that can be replaced.
		 * @param {fragment|string[]} fragmentedContent 
		 * @returns {string} concatenated the value of the array (if it is a fragment, it uses fragment.found property)
		 */
		_generateReplacedContent(fragmentedContent) {
			var replacedContent = "";
			var replacedContentHtml = "";
			for (var i = 0; i < fragmentedContent.length; i++) {
				if (typeof fragmentedContent[i] === "object") {
					if(fragmentedContent[i].replaceTo === ''){
						replacedContentHtml += '<span class="text-danger">' + fragmentedContent[i].found + '</span>';
					} else {
						replacedContentHtml += fragmentedContent[i].replaceTo;
					}
					replacedContent += fragmentedContent[i].found;
				} else {
					replacedContent += fragmentedContent[i];
					replacedContentHtml += fragmentedContent[i];
				}
			}
			return {replacedContent , replacedContentHtml};
		}

	};

	return GsmUMD;
});

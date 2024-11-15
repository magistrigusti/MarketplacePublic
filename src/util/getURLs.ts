export const getUrlExtension = (url: string) => {
    return new URL(url).pathname.split('.')[1];
};
export const mediaTypes = new Map<string, 'img' | 'video'>([
    ['jpg', 'img'],
    ['gif', 'img'],
    ['png', 'img'],
    ['mp4', 'video'],
    ['3gp', 'video'],
]);

export const urlRegExp = new RegExp(
    '(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))',
    'g'
);

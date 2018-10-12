function filterProperties(partnersAr: any, allowedKeys: any, log: boolean) {
  if (log) {
    console.log('full Ar to filter properties from: ', partnersAr);
  }
  return partnersAr 
    .map(partner => {
      return Object.keys(partner)
        .filter(key => allowedKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = partner[key];
          return obj;
        }, {});
  })
}

function readMoreSplit(content: string) {
  return content.split('<p><!--more--></p>');
}

function createMarkup(content) {
  return { __html: content };
};

function removeDuplicatesAr(ar) {
  return ar.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}

function someInBothAr(A, B) {
  return A.some(e => B.includes(e))
  

}

export {
  filterProperties,
  readMoreSplit,
  createMarkup,
  removeDuplicatesAr,
  someInBothAr
};

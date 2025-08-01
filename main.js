async function loadCSV() {
  const response = await fetch('./data/laws.csv');
  const text = await response.text();
  const rows = text.trim().split('\n').slice(1);
  return rows.map(row => {
    const [category, subcategory, content] = row.split(',');
    return { category, subcategory, content };
  });
}

function groupByCategory(data) {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  return grouped;
}

async function renderList() {
  const data = await loadCSV();
  const grouped = groupByCategory(data);
  const container = document.getElementById('law-list');
  container.innerHTML = '';

  Object.keys(grouped).forEach(category => {
    const section = document.createElement('div');
    section.className = 'law-section';

    const heading = document.createElement('h2');
    heading.textContent = category;
    section.appendChild(heading);

    const list = document.createElement('ul');
    grouped[category].forEach(item => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `detail.html?category=${encodeURIComponent(item.category)}&subcategory=${encodeURIComponent(item.subcategory)}`;
      link.textContent = item.subcategory;
      li.appendChild(link);
      list.appendChild(li);
    });

    section.appendChild(list);
    container.appendChild(section);
  });
}

renderList();
const filters = {
  date: document.getElementById('date'),
  company: document.getElementById('company'),
  importance: document.getElementById('importance'),
  keyword: document.getElementById('keyword'),
  apply: document.querySelector('.filters .secondary'),
  rows: Array.from(document.querySelectorAll('tbody tr')),
};

const normalize = (value) => value.trim().toLowerCase();

const parseTableDate = (value) => {
  const match = value.trim().match(/^(\d{1,2})\s*\/\s*(\d{1,2})$/);
  if (!match) return null;
  return {
    month: Number(match[1]),
    day: Number(match[2]),
  };
};

const matchesText = (text, keyword) => {
  if (!keyword) return true;
  return normalize(text).includes(keyword);
};

const matchesImportance = (row, importance) => {
  if (!importance || importance === '전체') return true;
  const badge = row.querySelector('.badge');
  return badge?.textContent.trim() === importance.charAt(0);
};

const matchesCompany = (row, company) => {
  if (!company || company === '전체') return true;
  const companyCell = row.querySelector('td:nth-child(2)');
  return companyCell && normalize(companyCell.textContent).includes(normalize(company));
};

const matchesDate = (row, dateValue) => {
  if (!dateValue) return true;

  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) return true;

  const dateCell = row.querySelector('td:first-child');
  if (!dateCell) return false;

  const parsed = parseTableDate(dateCell.textContent);
  if (!parsed) return false;

  return parsed.month === month && parsed.day === day;
};

const applyFilters = () => {
  const keyword = normalize(filters.keyword.value);
  const company = filters.company.value;
  const importance = filters.importance.value;
  const dateValue = filters.date.value;

  filters.rows.forEach((row) => {
    const text = row.textContent;
    const isVisible =
      matchesDate(row, dateValue) &&
      matchesCompany(row, company) &&
      matchesImportance(row, importance) &&
      matchesText(text, keyword);

    row.style.display = isVisible ? '' : 'none';
  });
};

filters.apply.addEventListener('click', applyFilters);
filters.keyword.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    applyFilters();
  }
});
filters.date.addEventListener('change', applyFilters);
filters.company.addEventListener('change', applyFilters);
filters.importance.addEventListener('change', applyFilters);

applyFilters();

// デフォルト初期データ
const defaultData = [
    {
        "id": 1,
        "word": "カスケード（cascade）",
        "category": "外来語",
        "fieldTag": "エンジニアリング",
        "eraTag": "現代",
        "reading": "かすけーど",
        "kanji": "",
        "english": "cascade",
        "meaning": "連鎖的に物事が起きること。または、上から下へ階段状に流れ落ちる滝や、そのように連なるものを指す。",
        "background": "原語はイタリア語の「cascata（滝）」やラテン語の「cadere（落ちる）」に由来し、元々は「小さな連なった滝」を意味していました。そこから派生して、現代ではIT、ビジネス、科学など様々な分野で「一つの事象が次の事象を芋づる式に引き起こす仕組みや現象」を指す言葉として広く使われています。",
        "nuance": "単に物事が連続するだけでなく、「上流から下流へ」「1つが引き金となって次々と自動的・不可避的に」伝播していくという、力強い連鎖のニュアンスを含みます。IT分野では機能の連鎖、ビジネスでは方針の浸透、医療では拒絶反応の連鎖など、文脈によってポジティブにもネガティブにも使われます。",
        "examples": [
            "経営陣が決定した経営戦略を、各部門へカスケードダウン（一貫して浸透）させる。",
            "システムの1ヶ所で発生したバグが、カスケード障害を引き起こしてサーバー全体がダウンした。",
            "CSS（Cascading Style Sheets）は、スタイルの優先順位が上から下へと連鎖的に適用される仕組みに基づいている。"
        ],
        "synonyms": ["連鎖", "ドミノ倒し", "波及", "芋づる式", "数珠繋ぎ"]
    },
    {
        "id": 2,
        "word": "かしずく（傅く）",
        "category": "古語・大和言葉",
        "fieldTag": "日常",
        "eraTag": "中世",
        "reading": "かしづく",
        "kanji": "傅く",
        "english": "",
        "meaning": "人に仕えて 大事に世話をする。また、子供を大切に養い育てる。",
        "background": "古語の「かしづく」に由来する言葉です。平安時代の貴族社会において、身分の高い人に仕えて身の回りの世話をすることや、親が大切な我が子をいつくしみ, 手を尽くして育てることを指す言葉として広く使われていました。現代では主に前者の「仕える」という意味合いが強く残っています。",
        "nuance": "単にお世話をするだけでなく、相手に対して「深い敬意」や「愛情」を持って、至れり尽くせりでもてなすというニュアンスが含まれます。現代の日常会話で使われることは稀で、小説や漫画などの創作物、あるいは格式高い表現の中で、主従関係や献身的な態度を強調する際によく用いられます。",
        "examples": [
            "若き女王の周りには、彼女に傅く大勢の侍従たちが控えていた。",
            "主人の一言で、使用人たちは一斉に傅いて命令に従った。",
            "両親から蝶よ花よと傅かれて育ったため、彼女は世間知らずなところがある。"
        ],
        "synonyms": ["仕える（つかえる）", "かしずき奉る", "お世話する", "奉公する", "傅育する（ふいくする）"]
    }
];

// アプリケーション状態
let wordData = [];
let currentWordId = -1;
let isNewWord = false;

// 検索・ソート・階層構造状態
let searchQuery = '';
let currentSort = 'id';
let currentHierarchy = 'category'; // 'category', 'fieldTag', 'eraTag' のいずれか
let openCategories = {};

// 1. 初期化処理
function initApp() {
    const savedData = localStorage.getItem('nango_data');
    if (savedData) {
        try {
            wordData = JSON.parse(savedData);
            wordData.forEach((item, index) => {
                if (!item.id) item.id = Date.now() + index;
                if (!item.category) item.category = "指定なし";
                if (item.fieldTag === undefined) item.fieldTag = "";
                if (item.eraTag === undefined) item.eraTag = "";
                if (item.reading === undefined) item.reading = "";
                if (item.kanji === undefined) item.kanji = "";
                if (item.english === undefined) item.english = "";
            });
        } catch (e) {
            wordData = JSON.parse(JSON.stringify(defaultData));
        }
    } else {
        wordData = JSON.parse(JSON.stringify(defaultData));
        saveToLocalStorage();
    }

    // 全ての階層グループを初期状態で展開に設定
    refreshOpenState();

    currentWordId = wordData.length > 0 ? wordData[0].id : -1;
    renderSidebarTree();
    showViewMode();
}

function refreshOpenState() {
    openCategories = {};
    wordData.forEach(w => {
        const key = w[currentHierarchy] || "(未設定)";
        openCategories[key] = true;
    });
}

function saveToLocalStorage() {
    localStorage.setItem('nango_data', JSON.stringify(wordData));
}

// 2. 検索・ソート・構造切り替え
function handleSearch() {
    searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    renderSidebarTree();
}

function setSort(type) {
    currentSort = type;
    document.getElementById('sort-id').classList.toggle('active', type === 'id');
    document.getElementById('sort-alpha').classList.toggle('active', type === 'alpha');
    renderSidebarTree();
}

function setHierarchyStructure(structType) {
    currentHierarchy = structType;
    document.getElementById('struct-cat').classList.toggle('active', structType === 'category');
    document.getElementById('struct-field').classList.toggle('active', structType === 'fieldTag');
    document.getElementById('struct-era').classList.toggle('active', structType === 'eraTag');

    refreshOpenState();
    renderSidebarTree();
}

function getProcessedWords() {
    let result = [...wordData];

    if (searchQuery) {
        result = result.filter(w => {
            return (w.word && w.word.toLowerCase().includes(searchQuery)) ||
                (w.reading && w.reading.toLowerCase().includes(searchQuery)) ||
                (w.kanji && w.kanji.toLowerCase().includes(searchQuery)) ||
                (w.english && w.english.toLowerCase().includes(searchQuery)) ||
                (w.fieldTag && w.fieldTag.toLowerCase().includes(searchQuery)) ||
                (w.eraTag && w.eraTag.toLowerCase().includes(searchQuery)) ||
                (w.meaning && w.meaning.toLowerCase().includes(searchQuery)) ||
                (w.synonyms && w.synonyms.some(s => s.toLowerCase().includes(searchQuery)));
        });
    }

    if (currentSort === 'alpha') {
        result.sort((a, b) => {
            const keyA = a.reading || a.word || '';
            const keyB = b.reading || b.word || '';
            return keyA.localeCompare(keyB, 'ja');
        });
    } else {
        result.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    return result;
}

// 3. サイドバーの階層構造（ツリー）生成
function renderSidebarTree() {
    const container = document.getElementById('treeContainer');
    container.innerHTML = '';

    const processedWords = getProcessedWords();

    if (processedWords.length === 0) {
        container.innerHTML = '<div style="font-size:12px; color:var(--muted-color); text-align:center; padding:20px 0;">該当する単語はありません</div>';
        return;
    }

    // 指定された属性基準（category / fieldTag / eraTag）でグループ分け
    const categorized = {};
    processedWords.forEach(word => {
        const groupKey = word[currentHierarchy] ? word[currentHierarchy].trim() : "(未設定)";
        if (!categorized[groupKey]) categorized[groupKey] = [];
        categorized[groupKey].push(word);
    });

    Object.keys(categorized).sort().forEach(groupName => {
        const words = categorized[groupName];

        const categoryDiv = document.createElement('div');
        categoryDiv.className = `tree-category ${openCategories[groupName] ? 'open' : ''}`;

        const header = document.createElement('div');
        header.className = 'tree-category-header';
        header.onclick = () => {
            categoryDiv.classList.toggle('open');
            openCategories[groupName] = categoryDiv.classList.contains('open');
        };

        const titleSpan = document.createElement('span');
        titleSpan.className = 'tree-category-title';
        titleSpan.innerHTML = `<span class="tree-toggle-icon">▶</span> ${groupName} (${words.length})`;

        header.appendChild(titleSpan);
        categoryDiv.appendChild(header);

        const wordListDiv = document.createElement('div');
        wordListDiv.className = 'tree-word-list';

        words.forEach(word => {
            const wordBtn = document.createElement('button');
            wordBtn.className = `tree-word-item ${word.id === currentWordId ? 'active' : ''}`;
            wordBtn.textContent = word.word ? word.word.split('（')[0].split('(')[0] : '無題';
            wordBtn.title = word.word;

            wordBtn.onclick = () => {
                currentWordId = word.id;
                document.querySelectorAll('.tree-word-item').forEach(btn => btn.classList.remove('active'));
                wordBtn.classList.add('active');
                showViewMode();
            };
            wordListDiv.appendChild(wordBtn);
        });

        categoryDiv.appendChild(wordListDiv);
        container.appendChild(categoryDiv);
    });

    document.getElementById('exportBtn').disabled = wordData.length === 0;
}

// 4. 右側メインコンテンツ表示
function showViewMode() {
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('managePanelMode').style.display = 'none';
    document.getElementById('viewMode').style.display = 'block';

    const target = document.getElementById('viewTarget');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    const currentWord = wordData.find(w => w.id === currentWordId);

    if (!currentWord || wordData.length === 0) {
        target.innerHTML = '<div class="empty-message">表示する単語が選択されていないか、データが存在しません。左のサイドバーから単語を選択してください。</div>';
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        return;
    }

    editBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'inline-block';

    const data = currentWord;
    const examplesHtml = (data.examples || []).map(ex => `<li>${ex}</li>`).join('');
    const synonymsHtml = (data.synonyms || []).map(syn => `<span class="synonym-tag">${syn}</span>`).join('');

    const extraTags = [
        data.reading ? `よみがな: ${data.reading}` : '',
        data.kanji ? `漢字: ${data.kanji}` : '',
        data.english ? `スペル: ${data.english}` : ''
    ].filter(Boolean).join(' | ');

    let tagsHtml = '';
    if (data.fieldTag) tagsHtml += `<span class="custom-tag tag-field">分野: ${data.fieldTag}</span>`;
    if (data.eraTag) tagsHtml += `<span class="custom-tag tag-era">時代: ${data.eraTag}</span>`;

    target.innerHTML = `
        <div class="word-header-container">
            <div class="word-title-row">
                <h2 class="word-title">${data.word || ''}</h2>
                <span class="category-badge">${data.category || '指定なし'}</span>
            </div>
            ${tagsHtml ? `<div class="tag-container">${tagsHtml}</div>` : ''}
            ${extraTags ? `<div class="word-sub-info">${extraTags}</div>` : ''}
        </div>
        
        <div class="section-title">意味</div>
        <div class="meaning-box">${data.meaning || ''}</div>
        
        <div class="section-title">言葉の背景 / 由来</div>
        <div class="text-content">${data.background || ''}</div>
        
        <div class="section-title">ニュアンス</div>
        <div class="text-content">${data.nuance || ''}</div>
        
        <div class="section-title">例文</div>
        <ul class="example-list">${examplesHtml || '<li>（登録なし）</li>'}</ul>
        
        <div class="section-title">類義語</div>
        <div class="synonym-container">${synonymsHtml || '<span style="color:var(--muted-color); font-size:14px;">（登録なし）</span>'}</div>
    `;
}

// 5. 編集・追加フォーム機能
function showEditForm() {
    isNewWord = false;
    document.getElementById('formTitle').textContent = "単語の編集";
    document.getElementById('viewMode').style.display = 'none';
    document.getElementById('managePanelMode').style.display = 'none';
    document.getElementById('editMode').style.display = 'block';

    const data = wordData.find(w => w.id === currentWordId);
    document.getElementById('editWord').value = data.word || '';
    document.getElementById('editCategory').value = data.category || '指定なし';
    document.getElementById('editFieldTag').value = data.fieldTag || '';
    document.getElementById('editEraTag').value = data.eraTag || '';
    document.getElementById('editReading').value = data.reading || '';
    document.getElementById('editKanji').value = data.kanji || '';
    document.getElementById('editEnglish').value = data.english || '';
    document.getElementById('editMeaning').value = data.meaning || '';
    document.getElementById('editBackground').value = data.background || '';
    document.getElementById('editNuance').value = data.nuance || '';
    document.getElementById('editExamples').value = (data.examples || []).join('\n');
    document.getElementById('editSynonyms').value = (data.synonyms || []).join(', ');
}

function showNewForm() {
    isNewWord = true;
    document.getElementById('formTitle').textContent = "新規単語追加";
    document.getElementById('viewMode').style.display = 'none';
    document.getElementById('managePanelMode').style.display = 'none';
    document.getElementById('editMode').style.display = 'block';

    document.getElementById('editWord').value = '';
    document.getElementById('editCategory').value = '指定なし';
    document.getElementById('editFieldTag').value = '';
    document.getElementById('editEraTag').value = '';
    document.getElementById('editReading').value = '';
    document.getElementById('editKanji').value = '';
    document.getElementById('editEnglish').value = '';
    document.getElementById('editMeaning').value = '';
    document.getElementById('editBackground').value = '';
    document.getElementById('editNuance').value = '';
    document.getElementById('editExamples').value = '';
    document.getElementById('editSynonyms').value = '';
}

function cancelEdit() {
    showViewMode();
}

function saveWord() {
    const word = document.getElementById('editWord').value.trim();
    if (!word) {
        alert('単語（表記）は必須入力です。');
        return;
    }

    const examples = document.getElementById('editExamples').value.split('\n').map(line => line.trim()).filter(Boolean);
    const synonyms = document.getElementById('editSynonyms').value.split(/[,，、\n]/).map(item => item.trim()).filter(Boolean);
    const category = document.getElementById('editCategory').value;
    const fieldTag = document.getElementById('editFieldTag').value.trim();
    const eraTag = document.getElementById('editEraTag').value.trim();

    if (isNewWord) {
        const newId = Date.now();
        wordData.push({
            "id": newId, "word": word, "category": category, "fieldTag": fieldTag, "eraTag": eraTag,
            "reading": document.getElementById('editReading').value.trim(),
            "kanji": document.getElementById('editKanji').value.trim(),
            "english": document.getElementById('editEnglish').value.trim(),
            "meaning": document.getElementById('editMeaning').value.trim(),
            "background": document.getElementById('editBackground').value.trim(),
            "nuance": document.getElementById('editNuance').value.trim(),
            "examples": examples, "synonyms": synonyms
        });
        currentWordId = newId;
    } else {
        const targetWord = wordData.find(w => w.id === currentWordId);
        Object.assign(targetWord, {
            word, category, fieldTag, eraTag,
            reading: document.getElementById('editReading').value.trim(),
            kanji: document.getElementById('editKanji').value.trim(),
            english: document.getElementById('editEnglish').value.trim(),
            meaning: document.getElementById('editMeaning').value.trim(),
            background: document.getElementById('editBackground').value.trim(),
            nuance: document.getElementById('editNuance').value.trim(),
            examples, synonyms
        });
    }

    saveToLocalStorage();
    refreshOpenState();
    renderSidebarTree();
    showViewMode();
}

function deleteCurrentWord() {
    if (currentWordId === -1) return;
    const targetWord = wordData.find(w => w.id === currentWordId);
    if (!confirm(`「${targetWord.word}」を削除してもよろしいですか？`)) return;

    const processed = getProcessedWords();
    const targetIndex = processed.findIndex(w => w.id === currentWordId);

    wordData = wordData.filter(w => w.id !== currentWordId);

    const nextProcessed = getProcessedWords();
    if (nextProcessed.length === 0) currentWordId = -1;
    else if (targetIndex >= nextProcessed.length) currentWordId = nextProcessed[nextProcessed.length - 1].id;
    else currentWordId = nextProcessed[targetIndex].id;

    saveToLocalStorage();
    renderSidebarTree();
    showViewMode();
}

// 6. 🛠️ タグ一覧・一括管理機能 (新規追加分)
function showManagePanel() {
    document.getElementById('viewMode').style.display = 'none';
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('managePanelMode').style.display = 'block';

    renderTagManagementTables();
}

function closeManagePanel() {
    showViewMode();
}

// タグ一覧の集計とテーブル描写
function renderTagManagementTables() {
    const fieldsMap = {};
    const erasMap = {};

    wordData.forEach(w => {
        if (w.fieldTag) fieldsMap[w.fieldTag] = (fieldsMap[w.fieldTag] || 0) + 1;
        if (w.eraTag) erasMap[w.eraTag] = (erasMap[w.eraTag] || 0) + 1;
    });

    // 分野タグテーブル生成
    let fieldHtml = `<table class="tag-table"><thead><tr><th>タグ名</th><th>該当単語数</th><th>操作</th></tr></thead><tbody>`;
    const fieldKeys = Object.keys(fieldsMap).sort();
    if (fieldKeys.length === 0) fieldHtml += `<tr><td colspan="3" style="color:var(--muted-color); text-align:center;">登録されている分野タグはありません</td></tr>`;
    else {
        fieldKeys.forEach(tag => {
            fieldHtml += `<tr>
                <td><span class="custom-tag tag-field">${tag}</span></td>
                <td><strong>${fieldsMap[tag]}</strong> 件</td>
                <td><button class="btn-sm" style="background:#f39c12; color:white; border:none;" onclick="renameTag('fieldTag', '${tag}')">名称一括変更</button></td>
            </tr>`;
        });
    }
    fieldHtml += `</tbody></table>`;
    document.getElementById('fieldTagsTableContainer').innerHTML = fieldHtml;

    // 時代タグテーブル生成
    let eraHtml = `<table class="tag-table"><thead><tr><th>タグ名</th><th>該当単語数</th><th>操作</th></tr></thead><tbody>`;
    const eraKeys = Object.keys(erasMap).sort();
    if (eraKeys.length === 0) eraHtml += `<tr><td colspan="3" style="color:var(--muted-color); text-align:center;">登録されている時代タグはありません</td></tr>`;
    else {
        eraKeys.forEach(tag => {
            eraHtml += `<tr>
                <td><span class="custom-tag tag-era">${tag}</span></td>
                <td><strong>${erasMap[tag]}</strong> 件</td>
                <td><button class="btn-sm" style="background:#f39c12; color:white; border:none;" onclick="renameTag('eraTag', '${tag}')">名称一括変更</button></td>
            </tr>`;
        });
    }
    eraHtml += `</tbody></table>`;
    document.getElementById('eraTagsTableContainer').innerHTML = eraHtml;
}

// タグ名の一括変更処理
function renameTag(tagType, oldTagName) {
    const label = tagType === 'fieldTag' ? '分野タグ' : '時代タグ';
    const newTagName = prompt(`現在の${label}名: 「${oldTagName}」\n新しいタグ名を入力してください（空にするとタグが削除されます）:`, oldTagName);

    if (newTagName === null) return; // キャンセル

    const trimmedNewTag = newTagName.trim();
    let count = 0;

    wordData.forEach(w => {
        if (w[tagType] === oldTagName) {
            w[tagType] = trimmedNewTag;
            count++;
        }
    });

    saveToLocalStorage();
    refreshOpenState();
    renderSidebarTree();
    renderTagManagementTables(); // 管理画面のテーブルを再描画
    alert(`合計 ${count} 件の単語の${label}を 「${oldTagName}」 から 「${trimmedNewTag || '(削除)'}」 に一括変更しました。`);
}

// 7. インポート・エクスポート・リセット (互換性維持)
function triggerImport() { document.getElementById('fileInput').click(); }

function importJSON(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return; //fileを受け取り損ねたら

    const filePromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    resolve(Array.isArray(imported) ? imported : [imported]);
                } catch (err) { reject(new Error(`ファイル「${file.name}」の解析に失敗しました。`)); }
            };
            reader.onerror = () => reject(new Error(`ファイル「${file.name}」の読み込みに失敗しました。`));
            reader.readAsText(file);
        });
    });

    Promise.all(filePromises/*jsonのiter*/)
        .then(results => {
            /*  results=[
                [{word1},{word2}],
                [{word3}] 
                        ] */
            let combinedData = results.flat();

            function WDformatcheck(combone, model) {
                al_messe = '正しい難語JSONデータフォーマットではありません。'
                for (let Modkey of object.keys(model)) {
                    if (Modkey.slice(0, 4) !== "\\") {
                        if (Modkey.slice(-1) === '$' && !combone[Modkey]) { alert(al_messe); return }
                        if (typeof model[Modkey] !== 'object') {
                            if (!combone[Modkey]) {
                                if (Modkey === 'id') { }//唯一のnum型
                                else { combone[Modkey] = '' };
                            }
                            else if (typeof combone[Modkey] !== model[Modkey]) alert(al_messe);
                        }
                        else if (Object.prototype.toString(combone[Modkey]) !== Object.prototype.toString(model[Modkey])) alert(al_messe);
                        if (Modkey === meanigs$) {
                            for (let mean_dict of combone[Modkey]) {
                                if (!mean_dict.definition$) { alert(al_messe); return }
                            }
                        }
                    }
                }
            }
            if (combinedData.length === 0 || !combinedData[0].word/*TODOすべてのデータでwordのチェックをする */) {
                alert(al_messe);
                return;
            }

            combinedData.forEach((item, index) => {
                if (!item.id) item.id = Date.now() + index;
                if (!item.category) item.category = "指定なし";
                if (item.fieldTag === undefined) item.fieldTag = "";
                if (item.eraTag === undefined) item.eraTag = "";
                if (item.reading === undefined) item.reading = "";
                if (item.kanji === undefined) item.kanji = "";
                if (item.english === undefined) item.english = "";
            });

            if (confirm(`合計 ${files.length} 個のファイルから ${combinedData.length} 件の単語を読み込みました。\n\n現在のリストに追加しますか？ (キャンセルで上書き)`)) {
                wordData = [...wordData, ...combinedData];
            } else {
                wordData = combinedData;
            }

            currentWordId = wordData.length > 0 ? wordData[0].id : -1;
            saveToLocalStorage();
            refreshOpenState();
            renderSidebarTree();
            showViewMode();
            alert('一括インポートが完了しました！');
        })
        .catch(error => { alert(error.message); })
        .finally(() => { event.target.value = ''; });
}

function exportJSON() {
    if (wordData.length === 0) return;
    const blob = new Blob([JSON.stringify(wordData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '難語データ_export.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetToDefault() {
    if (!confirm('データを最初の初期状態に戻しますか？\n自分で追加・編集したデータは消去されます。')) return;
    wordData = JSON.parse(JSON.stringify(defaultData));
    currentWordId = wordData[0].id;
    currentSort = 'id';
    currentHierarchy = 'category';
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sort-id').classList.add('active');
    document.getElementById('sort-alpha').classList.remove('active');
    document.getElementById('struct-cat').classList.add('active');
    document.getElementById('struct-field').classList.remove('active');
    document.getElementById('struct-era').classList.remove('active');

    refreshOpenState();
    saveToLocalStorage();
    renderSidebarTree();
    showViewMode();
}

// 起動
initApp();
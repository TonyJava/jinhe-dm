
    /*
     *	���İ����·��
     */
    URL_CORE = "../../";
    
    /*
     *	��̨��Ӧ���ݽڵ�����
     */
    XML_MAIN_TREE = "AppTree";
    XML_LOG_LIST = "LogList";
    XML_OPERATION = "Operation";
    XML_PAGE_LIST = "PageList";

    XML_LOG_INFO = "LogInfo";
    /*
     *	Ĭ��Ψһ�����ǰ׺
     */
    CACHE_GRID_ROW_DETAIL = "row__id";
    CACHE_VIEW_GRID_ROW_DETAIL = "viewRow__id";
    CACHE_TREE_NODE_DETAIL = "treeNode__id";
    CACHE_TREE_NODE_GRID = "treeNodeGrid__id";
    CACHE_MAIN_TREE = "tree__id";
    CACHE_TOOLBAR = "toolbar__id";
    CACHE_SEARCH_LOG = "searchLog__id";
    /*
     *	����
     */
    OPERATION_ADD = "�½�$label";
    OPERATION_VIEW = "�鿴\"$label\"";
    OPERATION_DEL = "ɾ��\"$label\"";
    OPERATION_EDIT = "�༭\"$label\"";
    OPERATION_SEARCH = "��ѯ\"$label\"";
    /*
     *	XMLHTTP�����ַ����
     */
    URL_INIT = "data/log_init.xml";
    URL_LOG_LIST = "data/loglist.xml";
    URL_LOG_DETAIL = "data/log1.xml";
    URL_GET_OPERATION = "data/operation.xml";
    URL_GET_LOG_OPERATION = "data/operation.xml";
    URL_SEARCH_LOG = "data/loglist.xml";

    URL_INIT = "../../../log/log!getAllApps4Tree.action";
    URL_LOG_LIST = "../../../log/log!queryLogs4Grid.action";
    URL_LOG_DETAIL = "../../../log/log!getLogInfo.action";
    URL_GET_OPERATION = "data/operation.xml";
    URL_GET_LOG_OPERATION = "data/operation.xml";
    URL_SEARCH_LOG = "../../../log/log!queryLogs4Grid.action";
    /*
     *	��ʱ
     */
    TIMEOUT_TAB_CHANGE = 200;
    TIMEOUT_GRID_SEARCH = 200;
    /*
     *	icon·��
     */
    ICON = "images/";

    var toolbar = null;

    /*
     *	����˵����ҳ���ʼ��
     *	������	
     *	����ֵ��
     */
    function init(){
        initPaletteResize();
        initListContainerResize();
        //initUserInfo();
        initToolBar();
        initNaviBar("mod.3");
        initMenus();
        initBlocks();
        initWorkSpace();
        initEvents();
        initFocus();

        loadInitData();
    }
    /*
     *	����˵����ҳ���ʼ����������(��������������)
     *	������	
     *	����ֵ��
     */
    function loadInitData(){
        var p = new HttpRequestParams();
        p.url = URL_INIT;

        var request = new HttpRequest(p);
        request.onresult = function(){
            var _operation = this.getNodeValue(XML_OPERATION);

            var groupTreeNode = this.getNodeValue(XML_MAIN_TREE);
            var groupTreeNodeID = CACHE_MAIN_TREE;

            Cache.XmlIslands.add(groupTreeNodeID,groupTreeNode);

            loadToolBar(_operation);
            initTree(groupTreeNodeID);
        }
        request.send();
    }
    /*
     *	����˵������������������
     *	������	string:_operation      ����Ȩ��
     *	����ֵ��
     */
    function loadToolBar(_operation){
        var xmlIsland = Cache.XmlIslands.get(CACHE_TOOLBAR);
        if(null==xmlIsland){//��û�оʹ���

            var str = [];
            str[str.length] = "<toolbar>";

            //����
            str[str.length] = "    <button id=\"a1\" code=\"p1\" icon=\"" + ICON + "icon_pre.gif\" label=\"��ҳ\" cmd=\"ws.prevTab()\" enable=\"true\"/>";
            str[str.length] = "    <button id=\"a2\" code=\"p2\" icon=\"" + ICON + "icon_next.gif\" label=\"��ҳ\" cmd=\"ws.nextTab()\" enable=\"true\"/>";
            str[str.length] = "    <separator/>";

            //Ӧ��
            str[str.length] = "    <button id=\"b1\" code=\"plog1\" icon=\"" + ICON + "view_list.gif\" label=\"�����־\" cmd=\"showLogList()\" enable=\"'_rootId'!=getTreeId()\"/>";
            str[str.length] = "    <button id=\"b2\" code=\"plog2\" icon=\"" + ICON + "search.gif\" label=\"������־\" cmd=\"searchLog()\" enable=\"'_rootId'!=getTreeId()\"/>";

            //��־
//            str[str.length] = "    <button id=\"c1\" code=\"pld1\" icon=\"" + ICON + "view.gif\" label=\"�鿴\" cmd=\"editLogInfo(false)\" enable=\"true\"/>";
            str[str.length] = "</toolbar>";

            var xmlReader = new XmlReader(str.join("\r\n"));
            var xmlNode = new XmlNode(xmlReader.documentElement);

            Cache.XmlIslands.add(CACHE_TOOLBAR,xmlNode);

            xmlIsland = xmlNode;

            //���빤����
            toolbar.loadXML(xmlIsland);
        }

        //������ʾ
        var buttons = xmlIsland.selectNodes("./button");
        for(var i=0,iLen=buttons.length;i<iLen;i++){
            var curButton = buttons[i];
            var id = curButton.getAttribute("id");
            var code = curButton.getAttribute("code");
            var enableStr = curButton.getAttribute("enable");

            var reg = new RegExp("(^"+code+",)|(^"+code+"$)|(,"+code+",)|(,"+code+"$)","gi");
            var visible = false;
            if("string"==typeof(_operation)){
                visible = (true==reg.test(_operation)?true:false);
            }
            toolbar.setVisible(id,visible);

            if(true==visible){
                var enable = Public.execCommand(enableStr);
                toolbar.enable(id,enable);
            }
        }
    }
    /*
     *	����˵�����˵���ʼ��
     *	������	
     *	����ֵ��
     */
    function initMenus(){
        initTreeMenu();
        initGridMenu();
    }
    /*
     *	����˵�������˵���ʼ��
     *	������	
     *	����ֵ��
     */
    function initTreeMenu(){
        var item1 = {
            label:"�����־",
            callback:showLogList,
            icon:ICON + "view_list.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeId() && true==getOperation("plog1");}
        }
        var item2 = {
            label:"������־",
            callback:searchLog,
            icon:ICON + "search.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeId() && true==getOperation("plog2");}
        }

        var treeObj = $("tree");

        var menu1 = new Menu();
        menu1.addItem(item1);
        menu1.addItem(item2);

        //menu1.attachTo(treeObj,"contextmenu");
        treeObj.contextmenu = menu1;
    }
    /*
     *	����˵����Grid�˵���ʼ��
     *	������	
     *	����ֵ��
     */
    function initGridMenu(){
        var gridObj = $("grid");
        var item1 = {
            label:"�鿴",
            callback:function(){
                editLogInfo(false);
            },
            icon:ICON + "view.gif",
            enable:function(){return true;},
            visible:function(){return true==getLogOperation("pld1");}
        }
        var item2 = {
            label:"������־",
            callback:searchLog,
            icon:ICON + "search.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeId() && true==getOperation("plog2");}
        }
        var item3 = {
            label:"������...",
            callback:function(){gridObj.hideCols();},
            icon:ICON + "hide_col.gif",
            enable:function(){return true;},
            visible:function(){return true;}
        }
        var item4 = {
            label:"����...",
            callback:function(){gridObj.search();},
            enable:function(){return true;},
            visible:function(){return true;}
        }

        var menu1 = new Menu();
        menu1.addItem(item1);
        menu1.addItem(item2);
        menu1.addSeparator();
        menu1.addItem(item3);
        menu1.addItem(item4);
        //menu1.attachTo(gridObj,"contextmenu");
        gridObj.contextmenu = menu1;
    }
    /*
     *	����˵���������ʼ��
     *	������	
     *	����ֵ��
     */
    function initBlocks(){
        var paletteObj = $("palette");
        Blocks.create(paletteObj);

        var treeContainerObj = $("treeContainer");
        Blocks.create(treeContainerObj,treeContainerObj.parentNode);

        var statusContainerObj = $("statusContainer");
        Blocks.create(statusContainerObj,statusContainerObj.parentNode,false);

        //״̬��Ϣ��ʵ���̳�WritingBlock��д����
        var block = Blocks.getBlock("statusContainer");
        if(null!=block){
            block.inherit(WritingBlock);
        }     
    }
    /*
     *	����˵����grid��ʼ��
     *	������	string:id                   grid����������ڵ�id
     *	����ֵ��
     */
    function initGrid(id){
        var gridObj = $("grid");
        Public.initHTC(gridObj,"isLoaded","onload",function(){
            loadGridEvents();
            loadGridData(id,"1");//Ĭ�ϵ�һҳ
        });
    }
    /*
     *	����˵����grid���¼�
     *	������	
     *	����ֵ��
     */
    function loadGridEvents(){
        var gridObj = $("grid");

        gridObj.onclickrow = function(){
            onClickRow(event);
        }
        gridObj.ondblclickrow = function(){
            onDblClickRow(event);
        }
        gridObj.onrightclickrow = function(){
            onRightClickRow(event);
        }
        gridObj.oninactiverow = function() {
            onInactiveRow(event);
        }
        gridObj.onsortrow = function() {
            onSortRow(event);
        }
    
    }
    /*
     *	����˵����grid��������
     *	������	string:treeID       grid����������ڵ�id
                string:page         ҳ��
                string:sortName     �����ֶ�
                string:direction    ������
     *	����ֵ��
     */
    function loadGridData(treeID,page,sortName,direction){
        var cacheID = CACHE_TREE_NODE_GRID + treeID;
        var treeGrid = Cache.Variables.get(cacheID);
        if(null==treeGrid){
            var p = new HttpRequestParams();
            p.url = URL_LOG_LIST;
            p.setContent("condition.appCode", treeID);
            p.setContent("page", page);
            if(null!=sortName && null!=direction){
                p.setContent("field", sortName);
                p.setContent("orderType", direction);
            }

            var request = new HttpRequest(p);
            request.onresult = function(){
                var sourceListNode = this.getNodeValue(XML_LOG_LIST);
                var sourceListNodeID = cacheID+"."+XML_LOG_LIST;

                var pageListNode = this.getNodeValue(XML_PAGE_LIST);
                var pageListNodeID = cacheID+"."+XML_PAGE_LIST;

                //���û�grid���ݸ��ڵ�����applicationId������
                sourceListNode.setAttribute("applicationId",treeID);

                //����ǰ�����м���_direction����
                if(null!=sortName && null!=direction){
                    var column = sourceListNode.selectSingleNode("//column[@name='" + sortName + "']");
                    if(null!=column){
                        column.setAttribute("_direction",direction);
                    }
                }

                Cache.XmlIslands.add(sourceListNodeID,sourceListNode);
                Cache.XmlIslands.add(pageListNodeID,pageListNode);
                Cache.Variables.add(cacheID,[sourceListNodeID,pageListNodeID]);

                loadGridDataFromCache(cacheID);
            }
            request.send();
        }else{        
            loadGridDataFromCache(cacheID);
        }
    }
    /*
     *	����˵����grid�ӻ����������
     *	������	string:cacheID   grid����������ڵ�id
     *	����ֵ��
     */
    function loadGridDataFromCache(cacheID){
        //���´���grid������
        createGridToolBar(cacheID);

        var xmlIsland = Cache.XmlIslands.get(cacheID+"."+XML_LOG_LIST);
        if(null!=xmlIsland){
            var gridObj = $("grid");
            gridObj.load(xmlIsland.node,null,"node");

            Focus.focus("gridTitle");
        }
    }
    /*
     *	����˵��������grid������
     *	������	string:cacheID   grid����������ڵ�id
     *	����ֵ��
     */
    function createGridToolBar(cacheID){
        var toolbarObj = $("gridToolBar");

        var xmlIsland = Cache.XmlIslands.get(cacheID+"."+XML_PAGE_LIST);
        if(null==xmlIsland){
            toolbarObj.innerHTML = "";
        }else{
            initGridToolBar(toolbarObj,xmlIsland,function(page){
                var gridBtRefreshObj = $("gridBtRefresh");
                var gridObj = $("grid");

                if(true==gridObj.hasData_Xml()){
                    var tempXmlIsland = new XmlNode(gridObj.getXmlDocument());
                    var tempAppId = tempXmlIsland.getAttribute("applicationId");
                    var sortName = tempXmlIsland.getAttribute("sortName");
                    var direction = tempXmlIsland.getAttribute("direction");
                    if("search"!=tempAppId){
                        //�����Ӧ����־grid����
                        delCacheData(CACHE_TREE_NODE_GRID + tempAppId);

                        loadGridData(tempAppId,page,sortName,direction);

                        //ˢ�¹�����
                        onInactiveRow();
                    }else{
                        loadSearchGridData(cacheID,page,sortName,direction);
                    }
                }
            });
        }
    }
    /*
     *	����˵������ʾ��־״̬��Ϣ
     *	������	number:rowIndex     grid�����к�
     *	����ֵ��
     */
    function showLogStatus(rowIndex){
        if(null==rowIndex){
            var rowID = "-";
            var operatorName = "-";
            var operateTime = "-";
        }else{
            var gridObj = $("grid");
            var rowNode = gridObj.getRowNode_Xml(rowIndex);
            var rowID = rowNode.getAttribute("id");
            var operatorName = rowNode.getAttribute("operatorName");
            var operateTime = rowNode.getAttribute("operateTime");
        }

        var block = Blocks.getBlock("statusContainer");
        if(null!=block){
            block.open();
            block.writeln("ID",rowID);
            block.writeln("������",operatorName);
            block.writeln("����ʱ��",operateTime);
            block.close();
        }
    }
    /*
     *	����˵������ʾ��־��ϸ��Ϣ
     *	������	boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
     *	����ֵ��
     */
    function editLogInfo(editable){
        var gridObj = $("grid");
        var rowIndex = gridObj.getCurrentRowIndex_Xml()[0];
        var rowNode = gridObj.getRowNode_Xml(rowIndex);
        var rowName = gridObj.getNamedNodeValue_Xml(rowIndex,"id");
        var rowID = rowNode.getAttribute("id");
        var applicationId = gridObj.getXmlDocument().getAttribute("applicationId");
        if("search"==applicationId){
            groupID = rowNode.getAttribute("applicationId");
        }

        var callback = {};
        callback.onTabClose = function(eventObj){
            delCacheData(eventObj.tab.SID);
        };
        callback.onTabChange = function(){
            setTimeout(function(){
                loadLogDetailData(rowID,editable);
            },TIMEOUT_TAB_CHANGE);
        };

        var inf = {};
        if(false==editable){
            inf.label = OPERATION_VIEW.replace(/\$label/i,rowName);
            inf.SID = CACHE_VIEW_GRID_ROW_DETAIL + rowID;
        }else{
            inf.label = OPERATION_EDIT.replace(/\$label/i,rowName);
            inf.SID = CACHE_GRID_ROW_DETAIL + rowID;
        }
        inf.defaultPage = "page1";
        inf.phases = null;
        inf.callback = callback;
        var tab = ws.open(inf);
        
    }
    /*
     *	����˵������־��ϸ��Ϣ��������
     *	������	string:logId                ��־id
                boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
     *	����ֵ��
     */
    function loadLogDetailData(logId,editable){
        if(false==editable){
            var cacheID = CACHE_VIEW_GRID_ROW_DETAIL + logId;
        }else{
            var cacheID = CACHE_GRID_ROW_DETAIL + logId;
        }
        var cacheID = CACHE_GRID_ROW_DETAIL + logId;
        var userDetail = Cache.Variables.get(cacheID);
        if(null==userDetail){
            var p = new HttpRequestParams();
            p.url = URL_LOG_DETAIL;
            p.setContent("id", logId);

            var request = new HttpRequest(p);
            request.onresult = function(){
                var logInfoNode = this.getNodeValue(XML_LOG_INFO);

                var logInfoNodeID = cacheID+"."+XML_LOG_INFO;

                Cache.XmlIslands.add(logInfoNodeID,logInfoNode);

                Cache.Variables.add(cacheID,[logInfoNodeID]);

                initLogPages(cacheID,editable);
            }
            request.send();
        }else{
            initLogPages(cacheID,editable);
        }
    }
    /*
     *	����˵������־���ҳ��������
     *	������	string:cacheID              ��������id
                boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
     *	����ֵ��
     */
    function initLogPages(cacheID,editable){
        var page1FormObj = $("page1Form");
        Public.initHTC(page1FormObj,"isLoaded","oncomponentready",function(){
            loadLogInfoFormData(cacheID,editable);
        });

        //���÷�ҳ��ť��ʾ״̬
        var page1BtPrevObj = $("page1BtPrev");
        var page1BtNextObj = $("page1BtNext");
        page1BtPrevObj.style.display = "none";
        page1BtNextObj.style.display = "none";

        //���ñ��水ť����
        var page1BtSaveObj = $("page1BtSave");
        page1BtSaveObj.disabled = editable==false?true:false;
    }
    /*
     *	����˵������־��Ϣxform��������
     *	������	string:cacheID              ��������id
                boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
     *	����ֵ��
     */
    function loadLogInfoFormData(cacheID,editable){
        var xmlIsland = Cache.XmlIslands.get(cacheID+"."+XML_LOG_INFO);
        if(null!=xmlIsland){
            var page1FormObj = $("page1Form");
            page1FormObj.editable = editable==false?"false":"true";
            page1FormObj.load(xmlIsland.node,null,"node");
        }
    }
    /*
     *	����˵������Դ����ʼ��
     *	������	string:cacheID      ��������ID
     *	����ֵ��
     */
    function initTree(cacheID){
        var treeObj = $("tree");
        Public.initHTC(treeObj,"isLoaded","oncomponentready",function(){
            initTreeData(cacheID);
        });
    }
    /*
     *	����˵������Դ����������
     *	������
     *	����ֵ��
     */
    function initTreeData(cacheID){
        var xmlIsland = Cache.XmlIslands.get(cacheID);
        if(null!=xmlIsland){
            var treeObj = $("tree");
            treeObj.load(xmlIsland.node);

            treeObj.onTreeNodeActived = function(eventObj){
                onTreeNodeActived(eventObj);
            }
            treeObj.onTreeNodeDoubleClick = function(eventObj){
                onTreeNodeDoubleClick(eventObj);
            }
            treeObj.onTreeNodeMoved = function(eventObj){
                onTreeNodeMoved(eventObj);
            }
            treeObj.onTreeNodeRightClick = function(eventObj){
                onTreeNodeRightClick(eventObj);
            }
        }    
    }
    /*
     *	����˵�����۽���ʼ��
     *	������	
     *	����ֵ��
     */
    function initFocus(){
        var treeTitleObj = $("treeTitle");
        var statusTitleObj = $("statusTitle");
        var gridTitleObj = $("gridTitle");

        Focus.register(treeTitleObj.firstChild);
        Focus.register(statusTitleObj.firstChild);
        Focus.register(gridTitleObj);
    }
    /*
     *	����˵�����¼��󶨳�ʼ��
     *	������	
     *	����ֵ��
     */
    function initEvents(){
        var treeBtRefreshObj = $("treeBtRefresh");
        var treeTitleBtObj = $("treeTitleBt");
        var statusTitleBtObj = $("statusTitleBt");
        var paletteBtObj = $("paletteBt");

        var treeTitleObj = $("treeTitle");
        var statusTitleObj = $("statusTitle");
        var gridTitleObj = $("gridTitle");
        
        Event.attachEvent(treeBtRefreshObj,"click",onClickTreeBtRefresh);
        Event.attachEvent(treeTitleBtObj,"click",onClickTreeTitleBt);
        Event.attachEvent(statusTitleBtObj,"click",onClickStatusTitleBt);
        Event.attachEvent(paletteBtObj,"click",onClickPaletteBt);

        Event.attachEvent(treeTitleObj,"click",onClickTreeTitle);
        Event.attachEvent(statusTitleObj,"click",onClickStatusTitle);
        Event.attachEvent(gridTitleObj,"click",onClickGridTitle);
    }
    /*
     *	����˵����������ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeActived(eventObj){
        var treeTitleObj = $("treeTitle");
        Focus.focus(treeTitleObj.firstChild.id);

        showTreeNodeStatus({id:"ID",name:"����",creator:"������",creatorTime:"����ʱ��",lastModifyUserName:"�޸���",lastdate:"�޸�ʱ��"});

        //��ֹ��Ϊ���빤�������ݶ����²���Ӧ˫���¼�
        clearTimeout(window._toolbarTimeout);
        window._toolbarTimeout = setTimeout(function(){
            loadToolBarData(eventObj.treeNode);
        },0);
    }
    /*
     *	����˵����˫�����ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeDoubleClick(eventObj){
        if("_rootId"!=getTreeId()){
            showLogList();
        }
    }
    /*
     *	����˵�����һ����ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeRightClick(eventObj){
        var treeObj = $("tree");
        var treeNode = eventObj.treeNode;

        showTreeNodeStatus({id:"ID",name:"����",creator:"������",creatorTime:"����ʱ��",lastModifyUserName:"�޸���",lastdate:"�޸�ʱ��"});

        var x = eventObj.clientX;
        var y = eventObj.clientY;
        getTreeOperation(treeNode,function(_operation){
            if(null!=treeObj.contextmenu){
                treeObj.contextmenu.show(x,y);                
            }
            loadToolBar(_operation);
        });
    }
    /*
     *	����˵�����϶����ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeMoved(eventObj){
        sortGroupTo(eventObj);
    }
    /*
     *	����˵��������grid��
     *	������	event:eventObj     �¼�����
     *	����ֵ��
     */
    function onClickRow(eventObj){    
        Focus.focus("gridTitle");

        var rowIndex = eventObj.result.rowIndex_Xml;
        showLogStatus(rowIndex);

        //��ֹ��Ϊ���빤�������ݶ����²���Ӧ˫���¼�
        clearTimeout(window._toolbarTimeout);
        window._toolbarTimeout = setTimeout(function(){
            loadLogToolBarData(rowIndex);
        },0);
    }
    /*
     *	����˵����˫��grid��
     *	������	event:eventObj     �¼�����
     *	����ֵ��
     */
    function onDblClickRow(eventObj){
        var rowIndex = eventObj.result.rowIndex_Xml;
        getGridOperation(rowIndex,function(_operation){
            //���༭Ȩ��
            var code = "pld1";
            var editable = checkOperation(code,_operation);

            editLogInfo(editable);
        });
    }
    /*
     *	����˵�����һ�grid��
     *	������	event:eventObj     �¼�����
     *	����ֵ��
     */
    function onRightClickRow(eventObj){
        var gridObj = $("grid");

        var rowIndex = eventObj.result.rowIndex_Xml;
        var rowNode = gridObj.getRowNode_Xml(rowIndex);

        var id = rowNode.getAttribute("id");
        var _operation = rowNode.getAttribute("_operation");
        var x = event.clientX;
        var y = event.clientY;

        if(null==_operation || ""==_operation){//����ڵ��ϻ�û��_operation���ԣ�������Ӻ�̨��ȡ��Ϣ
            var p = new HttpRequestParams();
            p.url = URL_GET_LOG_OPERATION;
            p.setContent("applicationId",id);

            var request = new HttpRequest(p);
            request.onresult = function(){
                _operation = this.getNodeValue(XML_OPERATION);
                rowNode.setAttribute("_operation",_operation);

                gridObj.contextmenu.show(x,y);
                loadToolBar(_operation);
            }
            request.send();
            
        }else{
            gridObj.contextmenu.show(x,y);
            loadToolBar(_operation);
        }
    }
    /*
     *	����˵��������grid�հ״�
     *	������	event:eventObj     �¼�����
     *	����ֵ��
     */
    function onInactiveRow(eventObj){
        var treeTitleObj = $("treeTitle");
        Focus.focus(treeTitleObj.firstChild.id);

        showTreeNodeStatus({id:"ID",name:"����",creator:"������",creatorTime:"����ʱ��",lastModifyUserName:"�޸���",lastdate:"�޸�ʱ��"});

        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        //��ֹ��Ϊ���빤�������ݶ����²���Ӧ˫���¼�
        clearTimeout(window._toolbarTimeout);
        window._toolbarTimeout = setTimeout(function(){
            loadToolBarData(treeNode);
        },0);
    }
    /*
     *	����˵��������grid��ͷ����
     *	������	event:eventObj     �¼�����
     *	����ֵ��
     */
    function onSortRow(eventObj){
        var name = eventObj.result.name;
        var direction = eventObj.result.direction;

        eventObj.returnValue = false;

        var gridObj = $("grid");
        var xmlIsland = new XmlNode(gridObj.getXmlDocument());
        xmlIsland.setAttribute("sortName",name);
        xmlIsland.setAttribute("direction",direction);

        var toolbarObj = $("gridToolBar");
        var curPage = toolbarObj.getCurrentPage();
        toolbarObj.gotoPage(curPage);
    }
    /*
     *	����˵������ʾ�û��б�
     *	������	                
     *	����ֵ��
     */
    function showLogList(){
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();
            initGrid(id);
        }
    }
    /*
     *	����˵������ȡ�ڵ�ID
     *	������	
     *	����ֵ��
     */
    function getTreeId(){
        var treeNodeState = null;
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            treeNodeState = treeNode.getId();
        }
        return treeNodeState;   
    }
   /*
     *	����˵����������־
     *	������	
     *	����ֵ��
     */
    function searchLog(){

        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var treeID = treeNode.getId();
            var treeName = treeNode.getName();
            var cacheID = CACHE_SEARCH_LOG + treeID;

            var condition = window.showModalDialog("searchlog.htm",{applicationId:treeID,title:"����\""+treeName+"\"�µ���־"},"dialogWidth:250px;dialogHeight:250px;");
            if(null!=condition){
                Cache.Variables.add("condition",condition);
                loadSearchGridData(cacheID,1);
            }
        }
    }
    /*
     *	����˵��������������ȡ�������
     *	������	string:cacheID      ��������id
                string:page         ҳ��
                string:sortName     �����ֶ�
                string:direction    ������
     *	����ֵ��
     */
    function loadSearchGridData(cacheID,page,sortName,direction){
        var condition = Cache.Variables.get("condition");
        if(null!=condition){
            var p = new HttpRequestParams();
            p.url = URL_SEARCH_LOG;

            var xmlReader = new XmlReader(condition.dataXml);
            var dataNode = new XmlNode(xmlReader.documentElement);
            p.setXFormContent(dataNode,condition.prefix);
            p.setContent("page",page);
            if(null!=sortName && null!=direction){
                p.setContent("field", sortName);
                p.setContent("orderType", direction);
            }

            var request = new HttpRequest(p);
            request.onresult = function(){
                var logListNode = this.getNodeValue(XML_LOG_LIST);
                var logListNodeID = cacheID+"."+XML_LOG_LIST;

                var pageListNode = this.getNodeValue(XML_PAGE_LIST);
                var pageListNodeID = cacheID+"."+XML_PAGE_LIST;

                //����־grid���ݸ��ڵ�����applicationId������
                logListNode.setAttribute("applicationId","search");

                //����ǰ�����м���_direction����
                if(null!=sortName && null!=direction){
                    var column = logListNode.selectSingleNode("//column[@name='" + sortName + "']");
                    if(null!=column){
                        column.setAttribute("_direction",direction);
                    }
                }

                Cache.XmlIslands.add(logListNodeID,logListNode);
                Cache.XmlIslands.add(pageListNodeID,pageListNode);
                Cache.Variables.add(cacheID,[logListNodeID,pageListNodeID]);

                
                initSearchGrid(cacheID);
            }
            request.send();
        }
    }
    /*
     *	����˵������ʼ�������û�grid
     *	������	string:cacheID      ��������id
     *	����ֵ��
     */
    function initSearchGrid(cacheID){
        var gridObj = $("grid");
        Public.initHTC(gridObj,"isLoaded","onload",function(){
            loadGridDataFromCache(cacheID);
            loadGridEvents();

            //ˢ�¹�����
            onInactiveRow();
        });
    
    }
    /*
     *	����˵���������־�б��Ҽ��˵����Ƿ�ɼ�
     *	������	string:code     ������
     *	����ֵ��
     */
    function getLogOperation(code){
        var flag = false;
        var gridObj = $("grid");
        var curRowIndex = gridObj.getCurrentRowIndex_Xml()[0];
        if(null!=curRowIndex){
            var curRowNode = gridObj.getRowNode_Xml(curRowIndex);
            var _operation = curRowNode.getAttribute("_operation");

            var reg = new RegExp("(^"+code+",)|(^"+code+"$)|(,"+code+",)|(,"+code+"$)","gi");
            if(true==reg.test(_operation)){
                flag = true;
            }
        }
        return flag;
    }
    /*
     *	����˵������������������
     *	������	treeNode:treeNode       treeNodeʵ��
     *	����ֵ��
     */
    function loadToolBarData(treeNode){
        if(null!=treeNode){
            getTreeOperation(treeNode,function(_operation){
                loadToolBar(_operation);
            });
        }
    }
    /*
     *	����˵����������־������
     *	������	
     *	����ֵ��
     */
    function loadLogToolBarData(rowIndex){
        if(null==rowIndex){
            loadToolBar("p1,p2");
            return;
        }

        getGridOperation(rowIndex,function(_operation){
            loadToolBar(_operation);
        });
    
    }
    /*
     *	����˵������ȡgrid����Ȩ��
     *	������	number:rowIndex         grid�к�
                function:callback       �ص�����
     *	����ֵ��
     */
    function getGridOperation(rowIndex,callback){
        var gridObj = $("grid");
        var rowNode = gridObj.getRowNode_Xml(rowIndex);
        var id = rowNode.getAttribute("id");
        var _operation = rowNode.getAttribute("_operation");

        if(null==_operation || ""==_operation){//����ڵ��ϻ�û��_operation���ԣ�������Ӻ�̨��ȡ��Ϣ
            var p = new HttpRequestParams();
            p.url = URL_GET_LOG_OPERATION;
            p.setContent("logId",id);

            var request = new HttpRequest(p);
            request.onresult = function(){
                _operation = this.getNodeValue(XML_OPERATION);
                rowNode.setAttribute("_operation",_operation);

                if(null!=callback){
                    callback(_operation);
                }
            }
            request.send();
            
        }else{
            if(null!=callback){
                callback(_operation);
            }
        }
    }
    /*
     *	����˵������ȡ������Ȩ��
     *	������	treeNode:treeNode       treeNodeʵ��
                function:callback       �ص�����
     *	����ֵ��
     */
    function getTreeOperation(treeNode,callback){
        var id = treeNode.getId();
        var _operation = treeNode.getAttribute("_operation");

        if(null==_operation || ""==_operation){//����ڵ��ϻ�û��_operation���ԣ�������Ӻ�̨��ȡ��Ϣ
            var p = new HttpRequestParams();
            p.url = URL_GET_OPERATION;
            p.setContent("applicationId",id);

            var request = new HttpRequest(p);
            request.onresult = function(){
                _operation = this.getNodeValue(XML_OPERATION);
                treeNode.setAttribute("_operation",_operation);

                if(null!=callback){
                    callback(_operation);
                }
            }
            request.send();            
        }else{
            if(null!=callback){
                callback(_operation);
            }
        }    
    }



    window.onload = init;

	//�ر�ҳ���Զ�ע��
    window.attachEvent("onunload", function(){
        if(10000<window.screenTop || 10000<window.screenLeft){
            logout();
        }
	});
import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)
  console.log('after declaration', selectedLang)

  useEffect(() => {
    const APIResultsLoading = async() => {
      const lastSessionLanguage = await fetch('/user-language', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}`
      });
      const resLastSessionLanguage = await lastSessionLanguage.json();
      console.log('resLastSessionLanguage', resLastSessionLanguage);

      if(resLastSessionLanguage.result) {

      var langue = 'fr'
      var country = 'fr'
        
      if(resLastSessionLanguage.langue == 'en'){
        var langue = 'en'
        var country = 'us'
      }
      
      props.changeLang(selectedLang)
      const url = 'https://newsapi.org/v2/top-headlines/sources?' +
      `language=${langue}&` +
      `country=${country}&` +
      'apiKey=ae98ebaa4a2f49eab9851d85382ead9a';
      const data = await fetch(url)
      const body = await data.json()
      setSourceList(body.sources)
      }
    }
    APIResultsLoading()
  }, [])

  useEffect(() => {
    const newsUpdate = async() => {
      var langue = 'fr'
      var country = 'fr'
        
      if(selectedLang == 'en'){
        var langue = 'en'
        var country = 'us'
      }

      props.changeLang(selectedLang)
      const url = 'https://newsapi.org/v2/top-headlines/sources?' +
      `language=${langue}&` +
      `country=${country}&` +
      'apiKey=ae98ebaa4a2f49eab9851d85382ead9a';
      const data = await fetch(url)
      const body = await data.json()
      setSourceList(body.sources)
    }
    newsUpdate(); 
  }, [selectedLang])

  const handleChangeLang = async (langue) => {
    setSelectedLang(langue);
    const userLanguage = await fetch('/language', {
      method: 'PUT',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `language=${langue}&token=${props.token}`
    });
    console.log('selectedLang', selectedLang)
  }

  return (
    <div>
        <Nav/>
       
       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/fr.png' onClick={() => handleChangeLang('fr')} />
          <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/uk.png' onClick={() => handleChangeLang('en')} /> 
        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state){
  return {selectedLang: state.selectedLang, token: state.token}
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)

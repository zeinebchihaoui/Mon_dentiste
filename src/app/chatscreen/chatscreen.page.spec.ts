import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatscreenPage } from './chatscreen.page';

describe('ChatscreenPage', () => {
  let component: ChatscreenPage;
  let fixture: ComponentFixture<ChatscreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatscreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
